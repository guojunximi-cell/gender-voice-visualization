#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os, random, json, statistics, hashlib, datetime
import sys, email.parser, traceback
import maxminddb

import acousticgender
import acousticgender.library.preprocessing as preprocessing
import acousticgender.library.phones as phones
import acousticgender.library.resonance as resonance

settings = acousticgender.library.settings.settings

# Helpers
random_id = lambda: str(random.randint(0, 2**32))

request_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

################## Form Handling ##################
print("Content-type:text/plain\r\n\r\n")

content_type   = os.environ.get('CONTENT_TYPE', '')
content_length = int(os.environ.get('CONTENT_LENGTH', 0))
raw_body       = sys.stdin.buffer.read(content_length)
msg            = email.parser.BytesParser().parsebytes(
    ('Content-Type: ' + content_type + '\r\n\r\n').encode() + raw_body
)

def get_field(name, default=None, decode=False):
    for part in (msg.get_payload() if msg.is_multipart() else []):
        if part.get_param('name', header='Content-Disposition') == name:
            raw = part.get_payload(decode=True)
            return raw.decode('utf-8') if (decode and raw is not None) else raw
    return default

uploaded_file = get_field('recording')
transcript    = get_field('transcript', decode=True)
lang          = get_field('lang', default='en', decode=True)
# Normalize: treat any zh-* locale as 'zh'
if lang and lang.startswith('zh'):
	lang = 'zh'
else:
	lang = 'en'


id = random_id()

tmp_dir =  settings['recordings'] + id

try:
	praat_output = preprocessing.process(uploaded_file, transcript, tmp_dir, lang)
	data = phones.parse(praat_output, lang)
	if not data.get('phones'):
		raise RuntimeError("MFA produced no alignment output. Check MFA setup and models.")
	weights = [0.7321428571428571, 0.26785714285714285, 0.0]
	resonance.compute_resonance(data, weights, lang)
	print(json.dumps(data))
except Exception as e:
	print(json.dumps({"error": str(e), "trace": traceback.format_exc()}))

countries = None
if os.path.exists('./countries.mmdb'):
	countries = maxminddb.open_database('./countries.mmdb')

# Logging
if settings['logs'] and os.path.exists(settings['logs']):
	try:
		ip = os.environ.get('REMOTE_ADDR') or ''
		ua = os.environ.get('HTTP_USER_AGENT') or ''
		country = None
		if countries is not None:
			record = countries.get(ip)
			if record and 'country' in record:
				country = record['country'].get('iso_code')
		logfile = settings['logs'] + request_date.replace(' ', '_') + '_' + id + '.json'
		with open(logfile, 'w') as f:
			log_info = {
				# Hash the IP so that we can count use by a single user
				# without compromising their privacy.
				'country': country,
				'ua': ua,
				'date': request_date,
				'referrer': get_field('referrer', decode=True),
				'lang': get_field('lang', decode=True),
				'screen-dimensions' : {
					'width' : get_field('screen-width', decode=True),
					'height' : get_field('screen-height', decode=True),
				}
			}
			log_info['id'] = hashlib.sha256((
				ip + ua + str(log_info['screen-dimensions'])
			).encode('utf-8')).hexdigest()
			f.write(json.dumps(log_info))
	except Exception:
		pass
