from flask import Flask, render_template, request, redirect, url_for
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import re

load_dotenv()

app = Flask(__name__)

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


def is_valid_email(email):
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(pattern, email)


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

        print("FORM DATA:", email, subject, message)

        # Bot protection
        if honeypot:
            return "", 204

        # Validation
        if not email or not subject or not message:
            return "Please fill all fields"

        if not is_valid_email(email):
            return "Invalid email address"

        # Email content
        body = f"""
New message from portfolio

Sender: {email}
Subject: {subject}

Message:
{message}
"""

        msg = MIMEText(body)
        msg["Subject"] = f"Portfolio Contact: {subject}"
        msg["From"] = EMAIL_USER
        msg["To"] = EMAIL_USER
        msg["Reply-To"] = email

        # Connect to Gmail SMTP
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(EMAIL_USER, EMAIL_PASS)

        server.sendmail(EMAIL_USER, EMAIL_USER, msg.as_string())

        print("EMAIL SENT SUCCESSFULLY")

        server.quit()


        return {"status": "success"}

    except Exception as e:
        print("Error:", e)
        return "Something went wrong while sending the email."


if __name__ == "__main__":
    app.run(debug=True)