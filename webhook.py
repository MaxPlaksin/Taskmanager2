#!/usr/bin/env python3
"""
Webhook для автоматического развертывания через GitHub
Запускается на сервере и слушает POST запросы от GitHub
"""

from flask import Flask, request, jsonify
import subprocess
import os
import hmac
import hashlib
import json

app = Flask(__name__)

# Секретный ключ для проверки подписи GitHub webhook
WEBHOOK_SECRET = os.environ.get('WEBHOOK_SECRET', 'your-secret-key-here')

# Путь к скрипту развертывания
DEPLOY_SCRIPT = '/path/to/your/project/Taskmanager2/deploy.sh'

def verify_signature(payload, signature):
    """Проверяет подпись GitHub webhook"""
    if not signature:
        return False
    
    # Убираем префикс 'sha256='
    signature = signature.replace('sha256=', '')
    
    # Создаем ожидаемую подпись
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

@app.route('/webhook', methods=['POST'])
def webhook():
    """Обработчик GitHub webhook"""
    try:
        # Получаем подпись из заголовков
        signature = request.headers.get('X-Hub-Signature-256')
        
        # Получаем payload
        payload = request.get_data()
        
        # Проверяем подпись
        if not verify_signature(payload, signature):
            print("❌ Неверная подпись webhook")
            return jsonify({'error': 'Unauthorized'}), 401
        
        # Парсим JSON
        data = json.loads(payload)
        
        # Проверяем, что это push в main ветку
        if (data.get('ref') == 'refs/heads/main' and 
            data.get('repository', {}).get('name') == 'Taskmanager2'):
            
            print("🔄 Получен push в main ветку, запускаем развертывание...")
            
            # Запускаем скрипт развертывания
            result = subprocess.run(
                ['bash', DEPLOY_SCRIPT],
                capture_output=True,
                text=True,
                timeout=300  # 5 минут таймаут
            )
            
            if result.returncode == 0:
                print("✅ Развертывание завершено успешно")
                return jsonify({
                    'status': 'success',
                    'message': 'Deployment completed successfully',
                    'output': result.stdout
                })
            else:
                print(f"❌ Ошибка развертывания: {result.stderr}")
                return jsonify({
                    'status': 'error',
                    'message': 'Deployment failed',
                    'error': result.stderr
                }), 500
        else:
            print("ℹ️ Push не в main ветку, пропускаем развертывание")
            return jsonify({'status': 'ignored', 'message': 'Not a main branch push'})
            
    except subprocess.TimeoutExpired:
        print("⏰ Таймаут развертывания")
        return jsonify({'status': 'error', 'message': 'Deployment timeout'}), 500
    except Exception as e:
        print(f"❌ Ошибка webhook: {str(e)}}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Проверка здоровья webhook сервиса"""
    return jsonify({'status': 'healthy', 'service': 'deployment-webhook'})

if __name__ == '__main__':
    print("🚀 Запускаем webhook сервер...")
    print(f"📡 Слушаем на порту 5002")
    print(f"🔗 Webhook URL: http://your-server:5002/webhook")
    app.run(host='0.0.0.0', port=5002, debug=False)
