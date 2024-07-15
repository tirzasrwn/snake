    Game snake ini dapat diakses melalui link **https://tirzasrwn.github.io/snake/ ** dari browser PC/Laptop. Berikut yang merupakan beberapa penjelasan fitur yang dimiliki game snake tersebut.
    
    Pertama, game ini memiliki kontrol menggunakan tombol panah pada keyboard untuk menggerakkan ular ke arah yang diinginkan oleh pemain. Tombol panah kiri menggerakkan ular ke kiri, tombol panah kanan ke kanan, tombol panah atas ke atas, dan tombol panah bawah ke bawah. 
    Fitur ini memungkinkan pemain untuk mengontrol ular dengan mudah dan intuitif.
    Kedua, dalam game ini terdapat mekanisme untuk menggambar ulang elemen permainan seperti ular, makanan (food), serta skor dan skor terbaik (best score) pada kanvas setiap saat. 
    Ini memastikan bahwa setiap perubahan dalam permainan seperti gerakan ular atau peningkatan skor segera direfleksikan di layar.
    Ketiga, terdapat fitur untuk menghitung skor saat pemain berhasil memakan makanan (food). Setiap kali ular berhasil memakan makanan, skor pemain bertambah. 
    Skor terbaik (best score) juga disimpan menggunakan localStorage, sehingga meskipun permainan di-refresh atau ditutup, skor tertinggi yang pernah dicapai tetap tersimpan.
    Keempat, game ini memiliki mekanisme untuk mendeteksi tabrakan antara kepala ular dengan tubuhnya sendiri atau dengan tepi layar (wall collision). 
    Jika ular menabrak tubuhnya sendiri atau keluar dari batas layar, permainan akan berakhir. Selanjutnya, layar akan menampilkan pesan "Game Over" dan skor tertinggi yang dicapai oleh pemain.
    Kelima, terdapat tombol "Restart" yang memungkinkan pemain untuk memulai kembali permainan setelah permainan berakhir. 
    Tombol ini terhubung dengan fungsi initializeGame, yang mengatur ulang posisi ular, makanan, serta memulai kembali perulangan permainan (game loop).

