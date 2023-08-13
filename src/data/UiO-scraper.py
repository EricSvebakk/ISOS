
import requests
import re
from bs4 import BeautifulSoup
import json

# ==================================================================================
	
def main():
	
	page = requests.get("https://www.uio.no/studier/emner/matnat/ifi")

	soup = BeautifulSoup(page.content, "html.parser")
	results = soup.find_all("td", {"class": "vrtx-course-description-name"})

	fields = {
		"programmering og systemarkitektur" : "PROSA",
		"robotikk og intelligente systemer" : "IRIS",
		"digital økonomi og ledelse" : "DIGØK",
		"design, bruk, interaksjon": "DESIGN",
		"språkteknologi": "SPRÅK",
		"computational science": "COMP",
		# "bioinformatics": "M-BIO",
	}
	
	regex = "(?!IN19[0-1]{1}0)(IN[0-9]{4}[A-Z]?)"
	
	year = {}
	year["h"] = 22
	year["v"] = 23
	
	file_name = "ifi_subjects_010823.json"
	
	# dictionary = scrape(results, regex, fields, year)
	
	# try:
	dictionary = json.load(open(file_name, "r"))
	validate_equivs(dictionary["nodes"])
	# except OSError:
	# 	dictionary = {}
	
	handle_files(dictionary, file_name)
	

# ==================================================================================
def scrape(results, regex, fields, year):
	
	dictionary = {
		"nodes":[],
		"links":[]
	}
	ids = {}
	num_results = 0
	
	for result in results:
			
		print("** ", end="")

		SUBJ = result.find("a")

		SUBJ_name = SUBJ.text.split(" ")[0]
		SUBJ_href = f"https://www.uio.no{SUBJ['href']}"
		
		# print("sh", SUBJ_href)

		SUBJ_page = requests.get(SUBJ_href)
		SUBJ_soup = BeautifulSoup(SUBJ_page.content, "html.parser")

		SUBJ_regEx = re.search(regex, SUBJ_name)

		
		if SUBJ_regEx:
			
			if (not SUBJ_name in ids.keys()):
				ids[SUBJ_name] = num_results
				num_results += 1
				
			node = {
				"id": ids[SUBJ_name],
				"code": SUBJ_name,
				"title": get_title(SUBJ_soup),
				
				"points": get_points(SUBJ_soup),
				"semester": get_semester(SUBJ_soup),
				"requires": get_priority(SUBJ_soup, fields),
				
				"msubs": None,
				"rsubs": None,
				
				"next_exam_date": None,
				"equivalent": None
			}
			
			num_results = get_mandatories(SUBJ_soup, SUBJ_name, regex, node, dictionary, ids, num_results)
			num_results = get_recommended(SUBJ_soup, SUBJ_name, regex, node, dictionary, ids, num_results)
			
			node["next_exam_date"] = get_exam_date(SUBJ_soup, SUBJ_href, node["semester"], year)
			node["equivalent"] = get_equivalent(SUBJ_soup, regex, node, dictionary["nodes"])
			
			print(node["id"], end=",")
			print(node["code"], end=",")
			print(node["points"], end=",")	
			print(node["semester"], end=",")
			print(node["requires"], end=",")
			print(node["msubs"], end=",")
			print(node["rsubs"], end=",")
			print(node["equivalent"], end=",")
			# print(node["next_exam_date"], end=",")
			
			dictionary["nodes"].append(node)
			
		print()

	print(f"# Results: {num_results}")
	
	return dictionary
	
# ==================================================================================
def handle_files(dictionary, file_name):
	
	json_obj = json.dumps(dictionary, indent=4)

	with open(file_name, "w") as outfile:
		outfile.write(json_obj)
		
	with open("temps.txt", "w") as outfile:
		for d in dictionary["nodes"]:
			outfile.write(f"{d['code']}: {d['next_exam_date']}\n")

# ==================================================================================
def get_title(page_soup):
	
	result = None
	soup = page_soup.find("title")
	
	if soup:
		result = soup.text.replace("\u2013", "-").split(" - ")
		result = result[1]
	
	return result

# ==================================================================================
def get_semester(page_soup):
	soup = None
	result = ""
	
	nor_soup = page_soup.find(text="Fakta om emnet")
	eng_soup = page_soup.find(text="Facts about this course")
	
	if nor_soup:
		soup = nor_soup
	else:
		soup = eng_soup
	
	if soup:
		result = soup.find_next().findChildren("dd")
		result = list(map(lambda x: x.text.strip(), result))[2]
		result = result.replace("\u00f8","ø").replace("\u00e5","å")
		result = result.lower()
		result = result.replace("and", "og")
		result = result.replace("autumn", "høst").replace("haust", "høst")
		result = result.replace("spring", "vår").replace("\n", "")
		result = ' '.join(result.split())
		
		if ((not "høst" in result) and (not "vår" in result)):
			result = None
	
	return result
	
# ==================================================================================
def get_points(page_soup):
	soup = None
	result = ""
	
	nor_soup = page_soup.find(text="Fakta om emnet")
	eng_soup = page_soup.find(text="Facts about this course")
	
	if nor_soup:
		soup = nor_soup
	else:
		soup = eng_soup
	
	if soup:
		result = soup.find_next().findChildren("dd")[0].text.strip()
		try:
			result = int(result)
		except:
			exit("check get_points()")
	
	return result

# ==================================================================================
def get_priority(page_soup, fields):
	
	soup = None
	result = []
	
	nor_soup = page_soup.find("h2", text="Opptak til emnet")
	eng_soup = page_soup.find("h2", text="Admission to the course")
	
	end1_soup = page_soup.find("h3", id="recommended-knowledge")
	end2_soup = page_soup.find("h2", id="overlapping-courses")
	end3_soup = page_soup.find("h2", id="teaching")
	
	if nor_soup:
		soup = nor_soup
	else:
		soup = eng_soup
	
	if end1_soup:
		end_soup = end1_soup
	elif end2_soup:
		end_soup = end2_soup
	elif end3_soup:
		end_soup = end3_soup
	
	if soup and end_soup:
		
		# print("START")
		# print(end_soup)
		# print(soup)
		# print("END")
			
		temp = soup
		while temp.get("id") != end_soup.get("id"):
			temp = temp.findNext()
			
			for key, val in fields.items():
				if (key.lower() in temp.text.lower()) and not (val in result):
					result.append(val)
	
	if result:
		return result
	else:
		return None

# ==================================================================================
def get_mandatories(page_soup, subj_name, regex, node, data, sub_ids, index):
	
	soup = None
	end_soup = None
	
	nor_soup = page_soup.find(text="Obligatoriske forkunnskaper")
	eng_soup = page_soup.find(text="Formal prerequisite knowledge")
	
	end1_soup = page_soup.find("h3", id="recommended-knowledge")
	end2_soup = page_soup.find("h2", id="overlapping-courses")
	end3_soup = page_soup.find("h2", id="teaching")
	
	# 
	if nor_soup:
		soup = nor_soup
	else:
		soup = eng_soup
	
	# 
	if end1_soup:
		end_soup = end1_soup
	elif end2_soup:
		end_soup = end2_soup
	elif end3_soup:
		end_soup = end3_soup
	
	# 
	if soup and end_soup:
	
		SUBJS = []
		
		# 
		# print("START")
		temp = soup.findNext()
		while temp.get("id") != end_soup.get("id"):
			
			# print(temp.text)
			SUBJ = re.findall(regex, temp.text)
			SUBJS.extend(SUBJ)
			
			temp = temp.findNext()
		# print("END")
		
		SUBJS = list(set(SUBJS))
		if (subj_name in SUBJS):
			SUBJS.remove(subj_name)
		SUBJS.sort()
	
		temp = re.findall(regex, soup.find_next().text)
		
		# 
		for SUBJ in SUBJS:
			
			if not (SUBJ in sub_ids.keys()):
				if (index == 46):
					print("FOUND!!!", SUBJ, index)
				sub_ids[SUBJ] = index
				index += 1
		
			data["links"].append({
				"source": sub_ids[SUBJ],
				"target": sub_ids[subj_name],
				"mandatory": True,
			})
		
		node["msubs"] = list(map(lambda x: sub_ids[x], SUBJS))
	# else:
		# print(not not soup, not not end_soup)		
		
	return index

# ==================================================================================
def get_recommended(page_soup, subj_name, regex, node, data, sub_ids, index):
	
	soup = None
	nor_soup = page_soup.find("h3", text="Anbefalte forkunnskaper")
	eng_soup = page_soup.find("h3", text="Recommended previous knowledge")
	end_soup = page_soup.find("h2", id="overlapping-courses")
	
	if nor_soup:
		soup = nor_soup
	else:
		soup = eng_soup
	
	if soup and end_soup:
		
		SUBJS = []
		
		# 
		temp = soup.findNext()
		while temp.get("id") != end_soup.get("id"):
			
			SUBJ = re.findall(regex, temp.text)
			SUBJS.extend(SUBJ)
			
			temp = temp.findNext()
			
		SUBJS = list(set(SUBJS))
		if (subj_name in SUBJS):
			SUBJS.remove(subj_name)
		SUBJS.sort()
		
		# 
		for SUBJ in SUBJS:
			
			if not (SUBJ in sub_ids.keys()):
				sub_ids[SUBJ] = index
				index += 1
			
			data["links"].append({
				"source": sub_ids[SUBJ],
				"target": sub_ids[subj_name],
				"mandatory": False,
			})
		
		node["rsubs"] = list(map(lambda x: sub_ids[x], SUBJS))
		
	return index

# ==================================================================================
def get_exam_date(page_soup, SUBJ_href, semester, year):
	
	semtext = ""

	# 
	if(semester == "spring" or semester == "vår"):
		semtext = f"v{year['v']}"
	if (semester == "autumn" or semester == "høst"):
		semtext = f"h{year['h']}"

	# 
	SUBJ_href = SUBJ_href.strip('index.html/')
	new_href = f"htt{SUBJ_href}/{semtext}/eksamen/index.html"
	
	# 
	SUBJ_page = requests.get(new_href)
	SUBJ_soup = BeautifulSoup(SUBJ_page.content, "html.parser")
	
	soup = None
	soup = SUBJ_soup.find_all("p", {"class":"exam-date"})
	result = None
	
	if soup:
		result = ' '.join(soup[0].text.split()).strip("Tid: ").strip("Time: ")
		# print("SOUP!", result)
		
	return result
		
# ==================================================================================
def get_equivalent(page_soup, regex, node, nodes):
	
	soup = page_soup.find("h2", id="overlapping-courses")
	end_soup = page_soup.find("h2", id="teaching")
	
	result = None
	
	if soup and end_soup:
		
		equivs = dict()
		
		# 
		temp = soup.findNext().findNext()
		while (temp != None) and (temp.name == "li"):
			
			mine = ' '.join(temp.text.split()).split(" studiepoeng overlapp med ")
				
			if (len(mine) < 2):
				mine = ' '.join(temp.text.split()).split(" credits overlap with ")
				
			equiv = re.findall(regex, mine[1])
			
			if (equiv and len(equiv) > 0):
				equivs[equiv[0]] = int(mine[0])
			
			temp = temp.findNextSibling()
		
		# print(equivs)
		
		result = equivs
	
	return result

# ==================================================================================
def validate_equivs(nodes):
	
	codes = list(map(lambda x : x["code"], nodes))
	# print(codes)
	
	for node in nodes:
		
		
		
		# print(node["code"], node["equivalent"])
		
			
		if (node["equivalent"]):
		# 	node["equivalent"] = list(set(node["equivalent"]))
			
			for equiv, points in node["equivalent"].copy().items():
				
				if (points != node["points"]):
					node["equivalent"].pop(equiv)
					print(equiv, points)
					continue
				
				if (not (equiv in codes)):
					node["equivalent"].pop(equiv)
					print(equiv, points)
					continue
				# else:
				# 	print("equiv", end=" ")
		
				# print(node["code"], equiv, points)
		
	

# ==================================================================================

if __name__ == "__main__":
	main()