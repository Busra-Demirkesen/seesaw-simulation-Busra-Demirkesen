# ⚖️ Tahterevalli Simülasyonu — *Saf JavaScript ile Fizik Uygulaması*

> 🎯 **HTML, CSS ve Vanilla JavaScript** kullanarak geliştirilmiş etkileşimli bir tahterevalli simülasyonu.  
> Kullanıcı, tahterevallinin üzerine tıklayarak rastgele ağırlıklarda (1–10 kg) nesneler bırakabilir.  
> Tahterevalli, bu nesnelerin tork etkisine göre **gerçekçi bir şekilde eğilir ve dengelenir**.

---

## 🌐 Canlı Demo
🔗 **GitHub Pages:** [https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/](https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/)  
📦 **Repo:** [https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen](https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen)

---

## 🧩 Proje Özeti
Bu proje, **yalnızca HTML, CSS ve saf JavaScript** kullanarak fiziksel denge prensibini görselleştirmeyi amaçlar.  
Kullanıcı her tıkladığında yeni bir nesne oluşturulur, tork hesaplanır, tahterevalli eğim açısını günceller ve animasyonlu olarak yeni konumuna döner.

---

## ⚙️ Kullanılan Teknolojiler

| Teknoloji | Açıklama |
|------------|-----------|
| 💻 **HTML5** | Sayfa yapısı ve temel iskelet |
| 🎨 **CSS3** | Görsel tasarım, animasyon ve responsive yapı |
| ⚡ **JavaScript (ES6)** | Fizik hesaplamaları, olay yönetimi, DOM manipülasyonu |
| 💾 **LocalStorage** | Sayfa yenilense bile nesneleri ve açıyı saklama |

---

## 🚀 Özellikler

✅ Tıklama ile rastgele (1–10 kg) ağırlıkta nesne oluşturma  
✅ Gerçek zamanlı **tork ve açı hesaplaması**  
✅ Akıcı **dönme animasyonu**  
✅ Sol / sağ tarafın toplam ağırlık, tork ve nesne sayısının canlı güncellenmesi  
✅ Açı bilgisinin dinamik olarak gösterilmesi  
✅ **LocalStorage** ile kalıcı veri saklama  
✅ Reset butonu ile sıfırlama  
✅ Tamamen responsive tasarım (mobil uyumlu)  
✅ İsteğe bağlı düşme sesi efekti 🎧  

---

## ⚖️ Fiziksel Mantık

Tahterevalli, **tork dengesine** göre eğilir:

```js
// Her nesne için tork hesabı
const torque = obj.weight * Math.abs(obj.distanceFromPivot);

// Açının hesaplanması (maksimum ±30 derece)
const raw = (rightTorque - leftTorque) / 10;
const angle = Math.max(-30, Math.min(30, raw));


---

## 🖱️ Tıklama Mantığı ve Hitbox Çözümü

Tahterevalli döndükçe tıklama alanı da dönüyordu, bu da nesnelerin **tam tıklanan noktanın biraz soluna düşmesine** neden oluyordu.  
Bu problemi çözmek için tahterevallinin üstüne sabit kalan, şeffaf bir **`.seesaw-hitbox`** katmanı eklendi.  
Tıklama artık bu sabit alan üzerinden yakalanıyor.

### 💡 Çözüm Kodu
```js
const hitRect = hitboxEl.getBoundingClientRect();
const sawRect = seesawEl.getBoundingClientRect();

const xOnHitbox = e.clientX - hitRect.left;
const deltaLeft = (hitRect.width - sawRect.width) / 2; // genişlik farkı düzeltmesi
let xOnSeesaw = xOnHitbox - deltaLeft;

xOnSeesaw = Math.max(0, Math.min(sawRect.width, xOnSeesaw)); // sınır içinde tut
const pivotX = sawRect.width / 2;
const distanceFromPivot = xOnSeesaw - pivotX;

addObject({ x: xOnSeesaw, distanceFromPivot });


---
