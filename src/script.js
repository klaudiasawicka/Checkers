document.addEventListener('DOMContentLoaded', function () {
    const plansza = document.querySelector('.plansza');
    const rozmiarPlanszy = 8;
    let zaznaczonyPionek = null;
    let turaBialych = true;
    let graZakonczona = false;

    function stworzPlansze() {
        for (let wiersz = 0; wiersz < rozmiarPlanszy; wiersz++) {
            for (let kolumna = 0; kolumna < rozmiarPlanszy; kolumna++) {
                const pole = document.createElement('div');
                pole.classList.add('pole');

                if ((wiersz + kolumna) % 2 === 0) {
                    pole.classList.add('jasne');
                } else {
                    pole.classList.add('ciemne');

                    if (wiersz < 3) {
                        const pionek = document.createElement('div');
                        pionek.classList.add('pionek', 'czarny');
                        pole.appendChild(pionek);
                    } else if (wiersz > 4) {
                        const pionek = document.createElement('div');
                        pionek.classList.add('pionek', 'biały');
                        pole.appendChild(pionek);
                    }
                }

                plansza.appendChild(pole);
            }
        }
    }

    function wybierzPionek(event) {
        if (graZakonczona) return;

        const element = event.target;

        if (element.classList.contains('pionek')) {
            if ((element.classList.contains('biały') && turaBialych) ||
                (element.classList.contains('czarny') && !turaBialych)) {
                
                if (zaznaczonyPionek) {
                    zaznaczonyPionek.classList.remove('zaznaczonyPionek');
                }

                zaznaczonyPionek = element;
                element.classList.add('zaznaczonyPionek');
            }
        } 
        else if (element.classList.contains('ciemne') && zaznaczonyPionek) {
            if (element.childElementCount === 0) { 
                const startPole = zaznaczonyPionek.parentElement;
                const startIndex = Array.from(plansza.children).indexOf(startPole);
                const startWiersz = Math.floor(startIndex / rozmiarPlanszy);
                const startKolumna = startIndex % rozmiarPlanszy;

                const targetPole = element;
                const targetIndex = Array.from(plansza.children).indexOf(targetPole);
                const targetWiersz = Math.floor(targetIndex / rozmiarPlanszy);
                const targetKolumna = targetIndex % rozmiarPlanszy;

                const przesuniecieWiersza = targetWiersz - startWiersz;
                const przesuniecieKolumny = targetKolumna - startKolumna;

                if (Math.abs(przesuniecieWiersza) === 1 && Math.abs(przesuniecieKolumny) === 1) {
                    targetPole.appendChild(zaznaczonyPionek);
                    zaznaczonyPionek.classList.remove('zaznaczonyPionek');
                    zaznaczonyPionek = null;
                    turaBialych = !turaBialych;
                    sprawdzKoniecGry();
                } 
                else if (Math.abs(przesuniecieWiersza) === 2 && Math.abs(przesuniecieKolumny) === 2) {
                    const wierszZbicia = startWiersz + przesuniecieWiersza / 2;
                    const kolumnaZbicia = startKolumna + przesuniecieKolumny / 2;
                    const poleZbicia = plansza.children[wierszZbicia * rozmiarPlanszy + kolumnaZbicia];

                    if (poleZbicia.childElementCount > 0 && poleZbicia.firstChild.classList.contains('pionek')) {
                        if (poleZbicia.firstChild.classList.contains('czarny') !== zaznaczonyPionek.classList.contains('czarny')) {
                            poleZbicia.removeChild(poleZbicia.firstChild);
                            targetPole.appendChild(zaznaczonyPionek);
                            zaznaczonyPionek.classList.remove('zaznaczonyPionek');
                            zaznaczonyPionek = null;
                            turaBialych = !turaBialych;
                            sprawdzKoniecGry();
                        }
                    }
                }
            }
        }
    }

    function sprawdzKoniecGry() {
        const bialePionki = document.querySelectorAll('.pionek.biały').length;
        const czarnePionki = document.querySelectorAll('.pionek.czarny').length;

        if (bialePionki === 0) {
            koniecGry('Czarne');
        } else if (czarnePionki === 0) {
            koniecGry('Białe');
        }
    }

    function koniecGry(zwyciezca) {
        graZakonczona = true;
        setTimeout(() => {
            alert(`Koniec gry! ${zwyciezca} wygrały!`);
        });
    }

    stworzPlansze();
    plansza.addEventListener('click', wybierzPionek);
});