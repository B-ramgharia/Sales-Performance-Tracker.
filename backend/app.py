import os
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from models import db, User, SalesRecord
import pandas as pd
from datetime import datetime
import bcrypt
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///sales.db')
if app.config['SQLALCHEMY_DATABASE_URI'] and app.config['SQLALCHEMY_DATABASE_URI'].startswith("postgres://"):
    app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')

CORS(app)
db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()


# --- Auth Routes ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 400
    
    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed.decode('utf-8')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user.password_hash.encode('utf-8')):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user={"username": user.username, "email": user.email}), 200
    
    return jsonify({"msg": "Bad email or password"}), 401

# --- Data Processing Routes ---
@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_data():
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400
    
    current_user_id = get_jwt_identity()
    
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        else:
            return jsonify({"msg": "Unsupported file format"}), 400
        
        # Data Cleaning
        df = df.fillna(0)
        
        records = []
        for _, row in df.iterrows():
            record = SalesRecord(
                product_name=row.get('Product', row.get('product_name', 'Unknown')),
                category=row.get('Category', row.get('category', 'General')),
                quantity=int(row.get('Quantity', row.get('quantity', 0))),
                price=float(row.get('Price', row.get('price', 0))),
                sale_date=pd.to_datetime(row.get('Date', row.get('sale_date', datetime.utcnow()))),
                user_id=current_user_id
            )
            records.append(record)
        
        db.session.bulk_save_objects(records)
        db.session.commit()
        
        return jsonify({"msg": f"Successfully uploaded {len(records)} records"}), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# --- Analytics Routes ---
@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    current_user_id = get_jwt_identity()
    records = SalesRecord.query.filter_by(user_id=current_user_id).all()
    
    if not records:
        return jsonify({
            "kpis": {"total_revenue": 0, "total_units": 0, "avg_order_value": 0},
            "charts": {"revenue_trends": [], "category_breakdown": []}
        })
    
    df = pd.DataFrame([r.to_dict() for r in records])
    df['sale_date'] = pd.to_datetime(df['sale_date'])
    
    total_revenue = df['total'].sum()
    total_units = df['quantity'].sum()
    avg_order_value = total_revenue / len(df) if len(df) > 0 else 0
    
    # Revenue Trends (Monthly)
    revenue_trends = df.resample('M', on='sale_date')['total'].sum().reset_index()
    revenue_trends['sale_date'] = revenue_trends['sale_date'].dt.strftime('%b %Y')
    
    # Category Breakdown
    category_breakdown = df.groupby('category')['total'].sum().reset_index()
    
    return jsonify({
        "kpis": {
            "total_revenue": round(total_revenue, 2),
            "total_units": int(total_units),
            "avg_order_value": round(avg_order_value, 2)
        },
        "charts": {
            "revenue_trends": revenue_trends.to_dict(orient='records'),
            "category_breakdown": category_breakdown.to_dict(orient='records')
        },
        "recent_sales": [r.to_dict() for r in records[-10:]] # Last 10
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)