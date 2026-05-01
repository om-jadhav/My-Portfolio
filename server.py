from flask import Flask, render_template, request, redirect, url_for
import os
import re
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

app = Flask(__name__)

# Load environment variables
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

def is_valid_email(email):
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(pattern, email)

def send_email(sender_email, subject, message, ip_address):
    try:
        body = f"""
New message from portfolio

Time: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
IP Address: {ip_address}

Sender: {sender_email}
Subject: {subject}

Message:
{message}
"""

        msg = MIMEText(body)
        msg["Subject"] = f"Portfolio Contact: {subject}"
        msg["From"] = EMAIL_USER
        msg["To"] = EMAIL_USER
        msg["Reply-To"] = sender_email

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)

        print("✅ Email sent successfully")

    except Exception as e:
        print("❌ EMAIL ERROR:", e)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/submit_form", methods=["POST"])
def submit_form():
    try:
        email = request.form.get("email")
        subject = request.form.get("subject")
        message = request.form.get("message")
        honeypot = request.form.get("website")
        ip_address = request.remote_addr

        print("FORM DATA:", email, subject, message, "| IP:", ip_address)

        # Bot protection
        if honeypot:
            print("Bot detected. Ignored.")
            return "", 204

        # Validation
        if not email or not subject or not message:
            return "Please fill all fields"

        if not is_valid_email(email):
            return "Invalid email address"

        # Send email instead of CSV
        send_email(email, subject, message, ip_address)

        return redirect(url_for("home"))

    except Exception as e:
        print("ERROR:", e)
        return "Something went wrong while sending the message."


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
