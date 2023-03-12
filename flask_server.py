# flask_server.py
from flask import Flask, request, Response, render_template, jsonify
import pandas as pd
import uuid
import qrcode
from pathlib import Path
import io
import os
import base64
import json
app = Flask(__name__,template_folder='/home/marco/update2023/templates')


uuid_email_mapping = {}
uuid_points_mapping ={}
@app.route('/score-points-to/<uuid>', methods=['GET'])
def score_points_to(uuid):
    # Check if the uuid exists in the csv file
    try:
        df = pd.read_csv('data.csv')
    except FileNotFoundError:
        return 'CSV file not found', 404

    if uuid not in df['uuid'].values:
        return f'uuid {uuid} not found in the csv file', 404
    
    # Create the dicts if they do not exist yet
    if uuid not in uuid_email_mapping:
        email = df[df['uuid'] == uuid]['email'].values[0]
        uuid_email_mapping[uuid] = email
    
    if uuid not in uuid_points_mapping:
        uuid_points_mapping[uuid] = 0
    
    # Update the points for the uuid
    points = 10.0
    uuid_points_mapping[uuid] += points
    write_dict_to_csv(uuid_email_mapping,"uuid_email_mapping",True)
    write_dict_to_csv(uuid_points_mapping,"uuid_points_mapping",True)

    return f'Points for uuid {uuid} updated to {uuid_points_mapping[uuid]}', 200

@app.route("/process", methods=["POST"])
def process_form():
    # Retrieve the data from the form submission
    form_data = request.form
    for key, value in form_data.items():
        print(f"{key}: {value}")
    form_data = add_uuid_field(form_data)
    qr_img = generate_qr_code(form_data)
    store_values_in_csv(form_data)
    qr_code_image_b64 = base64.b64encode(qr_img).decode("utf-8")
    # Do something with the form data (e.g., store it in a database, send it in an email, etc.)
    #return Response(qr_img, content_type="image/png")
    return render_template("response.html", qr_code_image_b64=qr_code_image_b64)

@app.route('/workshops/', methods=["GET"])
def get_workshops():
    with open('/usr/share/nginx/html/update2023/schedule.json', 'r') as file:
        data = json.load(file)
    return jsonify(data)

def add_uuid_field(data):
    data = data.copy() # make a copy of the ImmutableMultiDict to allow modifications
    uid = str(uuid.uuid4())
    data.update({'uuid': uid}) # add the new field
    print(data)
    return data
    
def write_dict_to_csv(data,filename,write_index):
    df = pd.DataFrame.from_dict(data, orient='index')
    df.to_csv(filename, index=write_index)

def store_values_in_csv(data):
    filename = 'data.csv'
    fields = ['fst_name', 'lst_name', 'email', 'city', 'state','uuid']
    
    # Check if the file exists, if not create it
    if(not(os.path.isfile(filename))):
        df = pd.DataFrame(columns=fields)
        df.to_csv(filename, index=False)

   
    # Append the data to the csv file
    df = pd.read_csv(filename)
    row = {field: data.get(field) for field in fields}
    df = df.append(row, ignore_index=True)
    df.to_csv(filename, index=False)

def generate_qr_code(data):
    uid =  data["uuid"]
    email = data["email"]
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    url = f"{data['uuid']}"
    qr.add_data(url)
    qr.make(fit=True)

    qr_path = Path("./qrCodes") / email
    qr_path.mkdir(parents=True, exist_ok=True)
    img = qr.make_image(fill_color="black", back_color="white")
    output = io.BytesIO()
    img.save(output)
    with open(qr_path / f"{email}.png", "wb") as f:
        img.save(f)
    return output.getvalue()

if __name__ == "__main__":
    app.run(port=8000)
