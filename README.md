# ⚖️ Seesaw Physics Simulator

Bu proje, kullanıcının tıklamalarıyla rastgele ağırlıktaki nesneleri bir tahterevalliye düşürerek anlık fiziksel dengeyi simüle eden tamamen saf JavaScript, HTML ve CSS ile oluşturulmuş interaktif bir simülasyondur.

## 🚀 Proje Canlı Bağlantısı

https://busra-demirkesen.github.io/seesaw-simulation-Busra-Demirkesen/


## ✨ Özellikler

-   **Gerçekçi Fizik:** Tahterevalli, yerleştirilen tüm nesnelerin ağırlık ve mesafe hesaplamalarına dayanan Tork (Moment) farkına göre eğilir.
-   **Kısıtlı Açı:** Eğilme açısı, gerçekçi bir deneyim için $\pm 30$ derece ile sınırlıdır.
-   **Kalıcı Durum:** Sayfa yenilendiğinde bile mevcut nesneler ve tahterevalli açısı Local Storage kullanılarak korunur.
-   **Zengin Geri Bildirim:** Nesneler **yukarıdan düşme animasyonu** ve **ses efekti** ile eklenir.
-   **Detaylı İstatistikler:** Anlık Açı, Tork ve Her İki Taraftaki Nesne Sayısı gibi metrikler kullanıcı arayüzünde görüntülenir.
-   **Log Kaydı:** Her düşürülen nesne, ağırlığı ve merkezi olan mesafesi ile birlikte olay günlüğüne kaydedilir.
-   **Temiz UI:** Gereksiz bilgi tekrarını önlemek için toplam ağırlık göstergesi kaldırılmıştır.

## 📐 Tasarım ve Uygulama Kararları

Bu bölümde, projenin geliştirilme sürecindeki önemli kararlarım ve karşılaştığım zorluklar yer almaktadır.

### Fizik ve Matematiksel Modeller

1.  **Tork Hesaplaması:**
    $$Torque = \sum (Weight \times |Distance\_From\_Pivot|)$$
    Tahterevallinin eğimini belirleyen ana etken Tork farkıdır.
2.  **Açı Hesaplaması ve Sınırlandırma:**
    $$\text{Angle} = \frac{(\text{RightTorque} - \text{LeftTorque})}{10}$$
    Farkı **10'a bölme kararı**, eğim oranını (hızını) ayarlamak için deneysel olarak alındı. Bu, tork farkının daha geniş bir aralıkta $\pm 30$ derece sınırına ulaşmasını sağlar. `clamp` yardımcı fonksiyonu, açıyı belirlenen $\pm 30$ derecenin ötesine geçmesini engeller.
3.  **Nesne Konumlandırma (Kayma Düzeltmesi):**
    Nesnelerin tıklanan noktaya tam olarak ortalanması için `el.style.left = object.x + 'px'` ile birlikte CSS'te `transform: translateX(-50%)` kullanılmıştır. Bu yaklaşım, nesne boyutundan bağımsız olarak hassas merkezlemeyi garanti etti ve nesnelerin ilk yerleştirmede sağa kayması sorununu çözdü.

### Görsel ve Etkileşim Kararları

* **Düşme Animasyonu:** Nesnelerin yukarıdan gelip tahterevalliye düşüşünü simüle etmek için CSS `@keyframes drop-from-top` kullanıldı. Bu animasyonun bitiminde `setTimeout` ile sınıfın kaldırılması, nesnenin tahterevalli ile birlikte doğal bir şekilde sallanmaya devam etmesini sağlar.
* **Renklendirme (`colorForWeight`):** Ağırlık 1'den 10'a çıktıkça rengin **yeşilden (daha hafif) kırmızıya (daha ağır)** dönmesi için HSL renk modeli kullanıldı. Bu, kullanıcının bir bakışta nesnenin ağırlığını anlamasını sağlar.
* **Ses Efekti:** Kullanıcının etkileşimine anında geri bildirim vermek amacıyla **HTML5 Audio API** kullanılarak bir düşme sesi eklendi.

### 🧩 Trade-Offs ve Sınırlamalar

1.  **Performans (Potansiyel):** Çok sayıda nesne (örneğin 200+) eklendiğinde, her tıklamada tüm nesneler üzerinde tork hesaplaması yapıldığı ve DOM manipulasyonu gerçekleştiği için performans düşüşü yaşanabilir. Bu, saf JS çözümünün doğal bir sınırlamasıdır.
2.  **Sınırlı Dinamik Hız:** Tahterevalli eğimi için `transition` kullanıldığı için, eğim hızı sabittir. Gerçekçi fizik simülasyonlarında, kuvvet azaldıkça eğim hızı yavaşlar (damping). Bu simülasyonda hız sabittir, ancak `ease-in-out` ile yumuşatılmıştır.
3.  **<Kendi Karşılaştığınız Diğer Bir Zorluğu veya Ticari Tavizi Buraya Ekleyin>**

## 🛠️ Kurulum

Projeyi yerel olarak çalıştırmak için şu adımları izleyin:

1.  Depoyu klonlayın:
    ```bash
    git clone [https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen.git](https://github.com/Busra-Demirkesen/seesaw-simulation-Busra-Demirkesen.git)
    ```
2.  Proje klasörüne gidin:
    ```bash
    cd seesaw-simulation-Busra-Demirkesen
    ```
3.  `index.html` dosyasını tarayıcınızda açın.

## 🤖 AI Yardımı

Bu projenin temel yapısı ve mantığı tamamen tarafımdan geliştirilmiştir. Ancak, aşağıdaki küçük görevler için AI araçlarından (ChatGPT/Copilot) yardım alınmıştır:

* **Refactoring:** Gereksiz UI bileşenlerinin ve fonksiyon çağrılarının kaldırılması (örn. `updateTotals()` fonksiyonu) ve bu kaldırma işleminden kaynaklanan hataların tespit edilmesi.
* **Commit Mesajları:** Proje adımlarına uygun İngilizce ve Türkçe commit mesajlarının hazırlanması.
* **<AI'ın Yardımcı Olduğu Diğer Kısımları Buraya Ekleyin.>**
