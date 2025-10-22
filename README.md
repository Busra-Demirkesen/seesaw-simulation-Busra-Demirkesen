# ⚖️ Tahterevalli Simülasyonu — *Saf JavaScript ile Fizik Uygulaması*

> 🎯 **HTML, CSS ve Vanilla JavaScript** kullanılarak geliştirilmiş interaktif bir tahterevalli simülasyonudur.  
> Kullanıcı, tahterevallinin üzerine tıklayarak **rastgele ağırlıklarda (1–10 kg)** nesneler bırakabilir.  
> Tahterevalli, bu nesnelerin **tork etkisine göre gerçekçi bir şekilde eğilir ve dengelenir.**

---

## 🌐 Canlı Demo & Kaynak

- 🔗 **GitHub Pages:** [https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/](https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/)
- 📦 **Repository:** [Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen](https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen)

---

## 🧩 Proje Özeti

Bu proje, **yalnızca HTML, CSS ve saf JavaScript** kullanarak fiziksel denge prensibini görselleştirmeyi amaçlar.  
Her kullanıcı tıklamasında yeni bir nesne oluşturulur, tork hesaplanır, tahterevallinin eğim açısı dinamik olarak yeniden hesaplanır  
ve animasyonlu bir geçişle yeni pozisyonuna döner.

---

## ⚙️ Kullanılan Teknolojiler

| 💡 Teknoloji | 📘 Açıklama |
|--------------|-------------|
| 💻 **HTML5** | Uygulamanın temel yapısı ve iskeleti |
| 🎨 **CSS3** | Görsel tasarım, animasyon ve responsive yapı |
| ⚡ **JavaScript (ES6)** | Fiziksel hesaplamalar, DOM manipülasyonu ve olay yönetimi |
| 💾 **LocalStorage** | Verilerin sayfa yenilense bile saklanması |

---

## 🚀 Özellikler

- ✅ Rastgele (1–10 kg) ağırlıkta nesne oluşturma  
- ✅ Gerçek zamanlı **tork ve açı** hesaplaması  
- ✅ Akıcı, **fizik temelli dönme animasyonu**  
- ✅ Sol / sağ tarafın toplam ağırlık, tork ve nesne sayısının canlı güncellenmesi  
- ✅ **LocalStorage** ile kalıcı veri saklama  
- ✅ **Reset butonu** ile sahneyi sıfırlama  
- ✅ **Responsive** (mobil uyumlu) tasarım  
- ✅ **Düşme sesi efekti (drop.mp3)** ile gerçekçi deneyim 🎧  

---

## ⚖️ Fiziksel Mantık

Tahterevalli, her bir nesnenin tork etkisine göre eğilir.

\`\`\`js
// Her nesne için tork hesabı
const torque = obj.weight * Math.abs(obj.distanceFromPivot);

// Tork farkına göre açı hesaplanır (maksimum ±30° aralığında)
const raw = (rightTorque - leftTorque) / 10;
const angle = Math.max(-30, Math.min(30, raw));
\`\`\`

### 📘 Açıklama

- 🔹 Sol tarafa nesne eklendikçe **sol tork** artar.  
- 🔹 Sağ tarafa nesne eklendikçe **sağ tork** artar.  
- 🔹 Tork farkı pozitifse tahterevalli sağa, negatifse sola eğilir.  
- 🔹 Maksimum eğim açısı ±30° ile sınırlandırılmıştır.  

---

## 🖱️ Tıklama Mantığı (Hitbox Çözümü)

Tahterevalli döndükçe tıklama alanı da dönüyordu, bu durum nesnelerin **tıklanan noktadan kaymasına** neden oluyordu.  
Bu problemi çözmek için tahterevallinin üstüne **sabit kalan şeffaf bir `.seesaw-hitbox` katmanı** eklendi.  
Artık tıklama işlemleri bu sabit alan üzerinden yakalanıyor. 🎯  

### 💡 Uygulanan Çözüm

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

- Nesneler artık **tam tıklanan noktaya** düşüyor.  
- Tahterevallinin açısı ne olursa olsun **sapma tamamen ortadan kalktı.** ✅

---

## 🧠 Uygulama Akışı

1. Kullanıcı tahterevalliye tıklar.  
2. Tıklama konumu `hitbox` üzerinden hesaplanır.  
3. Rastgele ağırlıkta nesne oluşturulur.  
4. `distanceFromPivot` değeri hesaplanır ve state’e eklenir.  
5. Torklar yeniden hesaplanır.  
6. Açı `computeAngle()` fonksiyonu ile güncellenir.  
7. UI (animasyon, istatistikler, ağırlıklar) yenilenir.  
8. Veriler `LocalStorage`’a kaydedilir.

---

## 🗂️ Klasör Yapısı

\`\`\`
/
├── index.html          # Uygulama iskeleti
├── styles.css          # Tasarım ve animasyonlar
├── app.js              # Uygulama mantığı
├── sound/
│   └── drop.mp3        # Nesne düşme sesi (opsiyonel)
└── README.md
\`\`\`

---

## 💾 LocalStorage Yapısı (Örnek)

\`\`\`json
{
  "objects": [
    { "id": 1, "weight": 8, "distanceFromPivot": -70 },
    { "id": 2, "weight": 4, "distanceFromPivot": 100 }
  ],
  "dropLogs": [
    { "time": 1697040000000, "weight": 8, "x": -70 },
    { "time": 1697040050000, "weight": 4, "x": 100 }
  ]
}
\`\`\`

---

## 🚀 Kurulum ve Kullanım

Bu proje **saf web teknolojileriyle** yazıldığı için ek kurulum gerekmez.  
Sadece dosyayı indirip tarayıcıda açmanız yeterlidir.

### 📥 Klonlama

\`\`\`bash
git clone https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen.git
cd seesaw-simulation-Busra-Demirkesen
\`\`\`

### ▶️ Çalıştırma

\`index.html\` dosyasını tarayıcıda açarak simülasyonu başlatabilirsiniz.

---

## 📱 Responsive Tasarım

- Mobil ve tablet ekranlarında **dokunmatik uyumlu arayüz**  
- Orantılı görseller ve **esnek boyutlandırma**  
- CSS `transform` tabanlı akıcı animasyonlar  

---

## 🧪 Geliştirme Notları

- Fiziksel denge hesaplamaları **gerçek tork prensiplerine** dayanır.  
- **Clamp** fonksiyonu ile açı değerleri ±30° aralığında tutulur.  
- **requestAnimationFrame** kullanılarak performanslı animasyon sağlanmıştır.  
- **Yerel depolama (LocalStorage)** ile kullanıcı deneyimi kalıcı hale getirilmiştir.

---

## 👩‍💻 Geliştirici

**Büşra Demirkesen**  
📅 *2025*  
🔗 [GitHub Profilim](https://github.com/Busra-Demirkesen)  
📧 *İletişim:* busrademirkesen2@gmail.com  

> ✨ “Basit bir fizik deneyi, doğru uygulanınca etkileşimli bir deneyime dönüşebilir.” — *Büşra Demirkesen*
