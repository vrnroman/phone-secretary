# phone-secretary

## Android application

### Goal:
 - provide phone owner with reminders, context, information about people and initiatives, problems

### Data sources:
 - access to email, Teams
 - photos (photos with the text of emails, meeting notes - need to use OCR to conveert into the text)
 - recorder (to be turned on during meetings), then transform to text. Need to understand where is voice of the owner and not to mess up info said by owner and by the other person


### Examples how to use data:
 - Record meetings: for example call regarding some problem, where the app needs to summarize and keep in memory problems, action items and people opinions
 - Catchup with the person "on the go", record discussion: it forms dossier on people with personal info (hobbies, family, plans) and opinions, that can help application owner to prepare for the next meeting

### Interface:
 - collect data:
	 - audio recorder: start recording immediately, distinguish what was said by owner and what was said by other person; at the end of recording owner can set who was the other person
	 - take a photo (of email or teams chat), then parse it and add into database
	 - manual input: owner can choose problem or person and add information into their dossier (as a text or as a voice recording)
 - database:
	 - dossier on people (choose person, then see information about him)
	 - dossier on problem (choose problem/initiative, then see information about it and people's opinions)
 - action items
	 - Action items on me (not to forget to do)
	 - Action items on the other people (not to forget to chase)
 - Reminders notifications of action items on me. Important to understand when to remind. For small tasks it's 2hours before deadline, for big tasks - 1 day before deadline

   
