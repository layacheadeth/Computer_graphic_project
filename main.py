from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

# @app.route("/week9")
# def week9():
#     return render_template("week9.html")

@app.route("/physic")
def salvador():
    return render_template("physic_engine.html")
    
if __name__ == "__main__":
    app.run(debug=True)