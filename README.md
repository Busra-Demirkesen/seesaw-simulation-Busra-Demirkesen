/**
 * 🎯 Bu dosya, "Tahterevalli Simülasyonu" projesinin README.md içeriğini
 * JavaScript ortamında kolayca görüntülemek veya başka bir dosyaya aktarmak için
 * bir değişken içinde saklar.
 *
 * 👩‍💻 Geliştirici: Büşra Demirkesen
 * 🌐 GitHub: https://github.com/Busra-Demirkesen
 * 📅 Tarih: 2025
 */

const readmeIcerigi = `
# ⚖️ Tahterevalli Simülasyonu — *Saf JavaScript ile Fizik Uygulaması*

> 🎯 **HTML, CSS ve Vanilla JavaScript** kullanarak geliştirilmiş etkileşimli bir tahterevalli simülasyonu.  
> Kullanıcı, tahterevallinin üzerine tıklayarak rastgele ağırlıklarda (1–10 kg) nesneler bırakabilir.  
> Tahterevalli, bu nesnelerin tork etkisine göre **gerçekçi bir şekilde eğilir ve dengelenir.**

---

## 🌐 Canlı Demo

🔗 **GitHub Pages:** [https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/](https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/)  
📦 **Repository:** [Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen](https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen)

---

## 🧩 Proje Özeti

Bu proje, **yalnızca HTML, CSS ve saf JavaScript** kullanarak fiziksel denge prensibini görselleştirmeyi amaçlar.  
Her tıklamada yeni bir nesne oluşturulur, tork hesaplanır, tahterevalli eğim açısını günceller  
ve animasyonlu olarak yeni konumuna geçer.

---

## ⚙️ Kullanılan Teknolojiler

| 💡 Teknoloji | 📘 Açıklama |
|--------------|-------------|
| 💻 **HTML5** | Sayfa yapısı ve temel iskelet |
| 🎨 **CSS3** | Görsel tasarım, animasyon ve responsive yapı |
| ⚡ **JavaScript (ES6)** | Fizik hesaplamaları, olay yönetimi, DOM manipülasyonu |
| 💾 **LocalStorage** | Sayfa yenilense bile verilerin korunması |

---

## 🚀 Özellikler

✅ Rastgele (1–10 kg) ağırlıkta nesne oluşturma  
✅ Gerçek zamanlı **tork ve açı** hesaplaması  
✅ Akıcı, fizik temelli **dönme animasyonu**  
✅ Sol / sağ tarafın toplam ağırlık, tork ve nesne sayısının canlı güncellenmesi  
✅ **LocalStorage** ile kalıcı veri saklama  
✅ Reset butonu ile sıfırlama  
✅ Responsive (mobil uyumlu) tasarım  
✅ İsteğe bağlı düşme sesi efekti 🎧  

---

## ⚖️ Fiziksel Mantık

Tahterevalli, **tork dengesine** göre eğilir:

\`\`\`js
// Her nesne için tork hesabı
const torque = obj.weight * Math.abs(obj.distanceFromPivot);

// Açının hesaplanması (maksimum ±30 derece)
const raw = (rightTorque - leftTorque) / 10;
const angle = Math.max(-30, Math.min(30, raw));
\`\`\`

🔹 Sol tarafa nesne eklendikçe sol tork artar.  
🔹 Sağ tarafa nesne eklendikçe sağ tork artar.  
🔹 Tork farkına göre tahterevalli ±30° aralığında eğilir.

---

## 🖱️ Tıklama Mantığı ve Hitbox Çözümü

Tahterevalli döndükçe tıklama alanı da dönüyordu, bu da nesnelerin **tam tıklanan noktanın biraz soluna düşmesine** neden oluyordu.  
Bu problemi çözmek için tahterevallinin üstüne **sabit kalan şeffaf bir** \`.seesaw-hitbox\` **katmanı** eklendi.  
Tıklama artık bu sabit alan üzerinden yakalanıyor. 🎯

### 💡 Çözüm Kodu

\`\`\`js
const hitRect = hitboxEl.getBoundingClientRect();
const sawRect = seesawEl.getBoundingClientRect();

const xOnHitbox = e.clientX - hitRect.left;
const deltaLeft = (hitRect.width - sawRect.width) / 2; // genişlik farkı düzeltmesi
let xOnSeesaw = xOnHitbox - deltaLeft;

// Sınır içinde tut
xOnSeesaw = Math.max(0, Math.min(sawRect.width, xOnSeesaw));

const pivotX = sawRect.width / 2;
const distanceFromPivot = xOnSeesaw - pivotX;

addObject({ x: xOnSeesaw, distanceFromPivot });
\`\`\`

### 🎯 Sonuç

Artık nesneler **her zaman tıklanan noktaya tam olarak düşüyor**,  
tahterevallinin açısı ne olursa olsun **konum sapması tamamen giderildi.** ✅

---

## 🚀 Kurulum ve Kullanım

Bu proje saf web teknolojileriyle yazıldığı için ek kurulum gerekmez.  
Sadece dosyayı indirip tarayıcıda açman yeterlidir.

### 📥 Klonlama

\`\`\`bash
git clone https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen.git
cd seesaw-simulation-Busra-Demirkesen
\`\`\`

### ▶️ Çalıştırma

\`index.html\` dosyasını tarayıcıda açarak simülasyonu başlat.

---

## 🧠 STAR Analizi — “Tıklama Sapması” Hatası

| Adım | Açıklama |
|------|-----------|
| **Situation (Durum)** | Bazı nesneler tıklanan noktanın biraz soluna düşüyordu. |
| **Task (Görev)** | Nesnelerin tam tıklanan noktaya düşmesini sağlamak. |
| **Action (Eylem)** | Sabit bir hitbox katmanı ekleyip, koordinat dönüşümü (`deltaLeft`) uygulandı. |
| **Result (Sonuç)** | Tıklama sapması tamamen düzeldi; artık tüm nesneler doğru noktaya düşüyor. |

---

## 🧱 Klasör Yapısı

\`\`\`
/
├── index.html
├── styles.css
├── app.js
├── sound/
│   └── drop.mp3 (isteğe bağlı)
└── README.md
\`\`\`

---

## 🧠 Bu Projeyle Öğrendiklerim

- Tork tabanlı denge fiziğini derinlemesine anladım ⚖️  
- DOM dönüşümlerinin koordinat sistemine etkisini öğrendim  
- Hitbox tekniğiyle dönüşten bağımsız tıklama koordinatları elde ettim  
- LocalStorage ile durumu saklamayı öğrendim  
- Basit araçlarla dinamik bir fizik simülasyonu kurdum 🚀  

---

## 📄 Lisans

Bu proje **MIT Lisansı** ile açık kaynak olarak paylaşılmıştır.  
Kod, eğitim ve kişisel projelerde serbestçe kullanılabilir. 📚

---

## 👩‍💻 Geliştirici

**Büşra Demirkesen**  
📅 *2025*  
🔗 [GitHub Profilim](https://github.com/Busra-Demirkesen)  
📧 *İletişim:* busrademirkesen.dev@gmail.com *(isteğe bağlı)*

> ✨ “Basit bir fizik deneyi, doğru uygulanınca etkileşimli bir deneyime dönüşebilir.” — *Büşra Demirkesen*
`;

console.log("%cREADME içeriği hazır! 🎉", "color: #42b883; font-weight: bold;");
console.log(readmeIcerigi);
