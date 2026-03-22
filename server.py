from flask import Flask, render_template, request, redirect, url_for
import csv
import os
import re
from datetime import datetime

app = Flask(__name__)

CSV_FILE = "messages.csv"

def is_valid_email(email):
    pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
    return re.match(pattern, email)

def initialize_csv():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow([
                "timestamp",
                "ip_address",
                "email",
                "subject",
                "message"
            ])
        print("CSV file created.")


initialize_csv()

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

        # Bot detection
        if honeypot:
            print("Bot detected. Ignored.")
            return "", 204

        # Validation
        if not email or not subject or not message:
            return "Please fill all fields"

        if not is_valid_email(email):
            return "Invalid email address"

        # Save to CSV
        with open(CSV_FILE, mode="a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow([
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                ip_address,
                email,
                subject,
                message
            ])

        print("Message stored successfully.")

        return redirect(url_for("home"))

    except Exception as e:
        print("ERROR:", e)
        return "Something went wrong while saving the message."

if __name__ == "__main__":
    app.run(debug=True)
