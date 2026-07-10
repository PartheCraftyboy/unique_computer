from flask import Flask, render_template
import json
import os

app = Flask(__name__)
BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")


def load_data(file):
    with open(os.path.join(DATA_DIR, file), "r", encoding="utf-8") as handle:
        return json.load(handle)


def load_all_products():
    apple_products = load_data("apple.json")
    windows_products = load_data("windows.json")
    return apple_products + windows_products


@app.route("/")
def home():
    featured = load_all_products()[:4]
    return render_template("index.html", products=featured)


@app.route("/apple")
def apple():
    products = load_data("apple.json")
    return render_template("apple.html", products=products, page_title="Apple Catalog")


@app.route("/windows")
def windows():
    products = load_data("windows.json")
    return render_template("windows.html", products=products, page_title="Windows Catalog")


@app.route("/catalog")
def catalog():
    products = load_all_products()
    return render_template("catalog.html", products=products, page_title="Premium Catalog")


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)