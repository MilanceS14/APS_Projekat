<h1>Sketcher</h1>

Projekat Sketcher će se baviti implementacijom popularne igre Pictionary, sa malo drugačijim pravilima.
<h2>Pravila:</h2>
1. Igrač koji je napravio sobu za igru je prvi koji crta proizvoljno izabrani termin (u daljem teksu crtač)
2. Crtač ima određeno vreme koje je odabrano prilikom kreiranje sobe da termin približi ostalim igračima, igrač koji prvi pogodi termin postaje crtač u sledećoj rundi. 
3. Igrač koji uspešno pogodi termin dobija poene, kao i crtač za uspešno objašnjavanje.
4. U slučaju da igrači ne uspeju da pogode termin kažnjavaju se svi oduzimanjem poena, a crtač u narednoj rundi postaje proizvoljno odabrana osoba.
5. Završetak igre je nakon poslednje runde (broj rundi je određen prilikom kreiranja sobe), pobednik je igrač koji ima najviše poena.


<h2>Instalacija i pokretanje projekta:</h2>
Za pokretanje projekta neophodno je instalirati [Meteor.js](https://www.meteor.com/install "Meteor.js installation")<br/>
U folderu gde želimo instalirati projekat, navigiramo cmd:<br/>

Kreirati novi projekat kucanjem naredve <b>meteor create myapp</b> (myapp je ime projekta koje možete promeniti)<br/>
Pozicionirati se u novi folder <b>cd myapp</b><br/>
Zatim odraditi sledeću naredbu <b>meteor npm install</b><br/>

Prekopirati Sketcher projekat u novo-napravljeni projekat.<br/>
U pokrenutom cmd-u u lokaciji projekta, izvršiti sledeći niz naredbi radi instaliranja neophodnih paketa:<br/>
<b>meteor add twbs:bootstrap<br/>
meteor add iron:router<br/>
meteor add fortawesome:fontawesome<br/>
meteor add juliancwirko:s-alert<br/>
meteor add session<br/>
meteor add service-configuration<br/>
meteor add accounts-password<br/>
meteor add flyandi:reactive-countdown<br/>
meteor add rocketchat:streamer<br/></b>


<b>Pokretanje</b> projekta se vrši izvršenjem naredbe <b>meteor</b><br/>
<b>Prekid</b> meteor programa izvršava se sa <b>Ctrl+C Ctrl+C</b>.
