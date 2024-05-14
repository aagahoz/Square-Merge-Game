// Karekok.js

class Karekok {
  constructor(ifade) {
    ifade = String(ifade)
    if (typeof ifade === 'string')
    { // ifade bir dize mi?
      if (ifade.includes("√"))
      { // √ sembolü varsa
        const parts = ifade.split("√"); // ifadeyi √ sembolüne göre ayır

        if (parts.length === 2)
        { // Eğer iki parça varsa
          const [reelKisim, tamKisim] = parts; // İki parçayı ayır
          const dereceIndex = tamKisim.indexOf("^"); // ^ sembolünün indeksini bul

          if (dereceIndex !== -1)
          { // ^ sembolü varsa
            this.kokluKisim = parseFloat(tamKisim.slice(0, dereceIndex)); // Derece öncesini kokluKisim olarak kabul et
            this.derece = parseFloat(tamKisim.slice(dereceIndex + 1)); // Dereceyi ayır ve parseFloat ile float'a çevir
          } else
          { // ^ sembolü yoksa
            this.kokluKisim = parseFloat(tamKisim); // Tam kısmı kokluKisim olarak kabul et
            this.derece = 1; // Derece 1 olacak
          }

          this.reelKisim = parseFloat(reelKisim); // reelKisim olarak kabul et
        } else
        { // Eğer parça sayısı 2 değilse
          throw new Error("Geçersiz karekök ifadesi"); // Geçersiz ifade hatası
        }
      } else
      { // √ sembolü yoksa
        this.kokluKisim = 1; // Koklu kısım 1 olacak
        this.derece = 1; // Derece 1 olacak
        this.reelKisim = parseFloat(ifade); // ifadeyi reelKisim olarak kabul et
      }
    } else
    { // ifade bir dize değilse
      this.kokluKisim = parseFloat(ifade); // ifadeyi köksüz bir sayı olarak kabul et
      this.derece = 1; // Derece 1 olacak
      this.reelKisim = 1; // reelKisim 1 olacak
    }
  }

  sayiyiYazdir() {
    let yazdirma = "";

    // Eğer reelKisim 1 değilse ve reelKisim NaN değilse
    if (this.reelKisim !== 1 && !isNaN(this.reelKisim))
    {
      yazdirma += this.reelKisim;
    }

    // Eğer kokluKisim 1 değilse
    if (this.kokluKisim !== 1)
    {
      yazdirma += "√" + this.kokluKisim;
    }

    // Eğer derece 1 değilse
    if (this.derece !== 1)
    {
      yazdirma += "^" + this.derece;
    }
    console.log("reelKisim değeri: " + this.reelKisim + " ");
    console.log("kokluKisim değeri: " + this.kokluKisim + " ");
    console.log("derece değeri: ^" + this.derece + "");

    console.log("Yazdırılan ifade: " + yazdirma); // Hazırlanan ifadeleri konsola yazdır
    console.log()
    console.log()
    return yazdirma;
  }

}

export default Karekok;
