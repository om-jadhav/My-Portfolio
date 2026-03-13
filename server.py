from flask import Flask,render_template,request
app = Flask(__name__)   

@app.route('/')
def hello_world1():
    return render_template('index.html');

@app.route('/#contact', methods=['POST', 'GET'])
def submit_form():
    if request.method == 'POST':
        data = request.form.to_dict()
        print(data)
        return 'Form submitted'
    else :
        return 'Something went wrong' 
if __name__ == "__main__":
    app.run(debug=True)