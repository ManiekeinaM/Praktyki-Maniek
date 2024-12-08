export class HighScores {
    constructor(list, cookieName) {
        this.list = list; // the ".highscoresList" element
        this.cookieName = cookieName || list.dataset.highscorecookie;
        console.log(this.cookieName, list);

        this.highscores = JSON.parse(this.getCookie(this.cookieName) || '[]');
        
    }

    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let c of ca) {
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = `${cname}=${cvalue};${expires};path=/`;
    }

    addScore(score) {
        const entry = {
            score: score,
            date: new Date(),
        };
        this.highscores.push(entry);
        this.highscores.sort((a, b) => {
            const scoreA = a.score !== undefined ? a.score : a;
            const scoreB = b.score !== undefined ? b.score : b;
            return scoreB - scoreA;
        });
        this.highscores = this.highscores.slice(0, 5);
        this.saveHighscores();
    }

    saveHighscores() {
        this.setCookie(this.cookieName, JSON.stringify(this.highscores), 9999);
    }

    updateHighscores() {
        this.list.innerHTML = '';

        this.highscores.forEach((scoreEntry, i) => {
            let div = document.createElement('div');

            if (scoreEntry.score !== undefined && scoreEntry.date) {
                let timeDiff = Date.now() - new Date(scoreEntry.date).getTime();
                let minutes = Math.floor(timeDiff / (1000 * 60));
                let hours = Math.floor(minutes / 60);
                let days = Math.floor(hours / 24);
                let dateText = '';

                if (minutes < 1) {
                    dateText = 'przed chwilą';
                } else if (minutes < 60) {
                    let subtext = minutes === 1 ? 'ę' : (minutes < 5 ? 'y' : '');
                    dateText = `${minutes} minut${subtext} temu`;
                } else if (hours < 24) {
                    let subtext = hours === 1 ? 'ę' : (hours < 5 ? 'y' : '');
                    dateText = `${hours} godzin${subtext} temu`;
                } else {
                    let subtext = days === 1 ? 'zień' : 'ni';
                    dateText = `${days} d${subtext} temu`;
                }

                let p = document.createElement('p');
                p.innerHTML = `#${i + 1}: ${scoreEntry.score} pkt`;
                let time = document.createElement('p');
                time.classList.add('scoreTime');
                time.innerHTML = `(${dateText})`;

                div.appendChild(p);
                div.appendChild(time);
            } else if (scoreEntry.score !== undefined) { // BACKWARDS COMPATIBILITY
                let p = document.createElement('p');
                p.innerText = `#${i + 1}: ${scoreEntry.score} pkt`;
    
                div.appendChild(p);
            } else if (scoreEntry !== undefined) {
                let p = document.createElement('p');
                p.innerText = `#${i + 1}: ${scoreEntry} pkt`;
                div.appendChild(p);
            } 

            this.list.appendChild(div);
        });
    }
}