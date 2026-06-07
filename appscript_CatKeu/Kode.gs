/**
 * Inisialisasi Database dengan kolom tambahan "Dibuat Oleh" dan sheet Aset
 */
function initDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Sheet Transaksi
  var txSheet = ss.getSheetByName("Transaksi");
  if (!txSheet) {
    txSheet = ss.insertSheet("Transaksi");
    txSheet.appendRow(["ID", "Tanggal", "Kategori", "Jumlah", "Keterangan", "Dibuat Oleh"]);
    txSheet.setFrozenRows(1); 
  } else {
    // Memastikan header kolom ke-6 ada jika sheet sudah pernah terbuat sebelumnya
    var headers = txSheet.getRange(1, 1, 1, 6).getValues()[0];
    if (!headers[5]) {
      txSheet.getRange(1, 6).setValue("Dibuat Oleh");
    }
  }
  
  // 2. Sheet Kategori
  var catSheet = ss.getSheetByName("Kategori");
  if (!catSheet) {
    catSheet = ss.insertSheet("Kategori");
    catSheet.appendRow(["ID", "Nama Kategori"]);
    catSheet.setFrozenRows(1);
    
    // Tambah kategori bawaan jika baru dibuat, disesuaikan dengan gambar budget user
    var defaultCats = [
      ["CAT-1", "Kos"],
      ["CAT-2", "Auto"],
      ["CAT-3", "Makan"],
      ["CAT-4", "Bensin"],
      ["CAT-5", "Gerry"],
      ["CAT-6", "Lainnya"],
      ["CAT-7", "Makanan & Minuman"],
      ["CAT-8", "Transportasi"],
      ["CAT-9", "Belanja"]
    ];
    for (var i = 0; i < defaultCats.length; i++) {
      catSheet.appendRow(defaultCats[i]);
    }
  }

  // 3. Sheet Aset (Aset Keuangan)
  var asetSheet = ss.getSheetByName("Aset");
  if (!asetSheet) {
    asetSheet = ss.insertSheet("Aset");
    asetSheet.appendRow(["Nama Aset", "Iren", "Aldo"]);
    asetSheet.setFrozenRows(1);
    
    // Sesuai dengan data pada gambar user
    var defaultAssets = [
      ["BCA", 8000000, 60000],
      ["BRI", 7000000, 281000],
      ["Gopay", 14760, 0],
      ["Shopee", 4051, 0],
      ["OVO", 27156, 0],
      ["Cash", 300000, 30000],
      ["Bibit", 0, 0],
      ["Bibit Gerry", 0, 0],
      ["Saham", 1000000, 4000000]
    ];
    for (var i = 0; i < defaultAssets.length; i++) {
      asetSheet.appendRow(defaultAssets[i]);
    }
  } else {
    // Memastikan header kolom ke-2 diganti dari Awrin ke Iren jika sudah ada
    var headers = asetSheet.getRange(1, 1, 1, 3).getValues()[0];
    if (headers[1] === "Awrin") {
      asetSheet.getRange(1, 2).setValue("Iren");
    }
  }

  // 4. Sheet Anggaran
  var angSheet = ss.getSheetByName("Anggaran");
  if (!angSheet) {
    angSheet = ss.insertSheet("Anggaran");
    angSheet.appendRow(["User", "Kategori", "Nominal"]);
    angSheet.setFrozenRows(1);
    
    // Sesuai dengan data gambar user
    var defaultBudgets = [
      ["Aldo", "Kos", 752500],
      ["Aldo", "Auto", 0],
      ["Aldo", "Makan", 1600000],
      ["Aldo", "Bensin", 300000],
      ["Aldo", "Lainnya", 1000000],
      ["Iren", "Kos", 500000],
      ["Iren", "Auto", 991100],
      ["Iren", "Makan", 1400000],
      ["Iren", "Bensin", 200000],
      ["Iren", "Gerry", 0],
      ["Iren", "Lainnya", 1200000]
    ];
    for (var i = 0; i < defaultBudgets.length; i++) {
      angSheet.appendRow(defaultBudgets[i]);
    }
  }
}

/**
 * 1. CREATE TRANSAKSI: Menyimpan transaksi beserta nama pembuatnya
 */
function tambahData(data) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Transaksi");
  
  var id = "TX-" + new Date().getTime();
  
  sheet.appendRow([
    id,
    data.tanggal,
    data.kategori,
    Number(data.jumlah),
    data.keterangan,
    data.pembuat // Menyimpan siapa yang mencatat ("Aldo" atau "Iren")
  ]);
  
  return { status: "success", message: "Data berhasil disimpan oleh " + data.pembuat, id: id };
}

/**
 * 2. READ TRANSAKSI: Mengambil data beserta informasi pembuatnya
 */
function ambilSemuaData() {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Transaksi");
  var dataValues = sheet.getDataRange().getDisplayValues();
  
  var hasil = [];
  
  for (var i = 1; i < dataValues.length; i++) {
    if (!dataValues[i][0]) continue; // Skip baris kosong
    hasil.push({
      id: dataValues[i][0],
      tanggal: dataValues[i][1], 
      kategori: dataValues[i][2],
      jumlah: Number(dataValues[i][3]) || 0,
      keterangan: dataValues[i][4],
      pembuat: dataValues[i][5] || "Tidak Diketahui"
    });
  }
  
  return hasil;
}

/**
 * 3. UPDATE TRANSAKSI: Mengubah data berdasarkan ID
 */
function ubahData(id, dataBaru) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Transaksi");
  var dataValues = sheet.getDataRange().getValues();
  
  for (var i = 1; i < dataValues.length; i++) {
    if (dataValues[i][0] === id) {
      var barisKe = i + 1;
      sheet.getRange(barisKe, 2).setValue(dataBaru.tanggal);
      sheet.getRange(barisKe, 3).setValue(dataBaru.kategori);
      sheet.getRange(barisKe, 4).setValue(Number(dataBaru.jumlah));
      sheet.getRange(barisKe, 5).setValue(dataBaru.keterangan);
      sheet.getRange(barisKe, 6).setValue(dataBaru.pembuat); // Update pembuat
      return { status: "success", message: "Data berhasil diubah!" };
    }
  }
  return { status: "error", message: "ID tidak ditemukan" };
}

/**
 * 4. DELETE TRANSAKSI: Menghapus data berdasarkan ID
 */
function hapusData(id) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Transaksi");
  var dataValues = sheet.getDataRange().getValues();
  
  for (var i = 1; i < dataValues.length; i++) {
    if (dataValues[i][0] === id) {
      var barisKe = i + 1;
      sheet.deleteRow(barisKe);
      return { status: "success", message: "Data berhasil dihapus!" };
    }
  }
  return { status: "error", message: "ID tidak ditemukan" };
}

/**
 * 5. READ KATEGORI: Ambil semua kategori dari sheet Kategori
 */
function ambilSemuaKategori() {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Kategori");
  var dataValues = sheet.getDataRange().getDisplayValues();
  
  var hasil = [];
  for (var i = 1; i < dataValues.length; i++) {
    if (!dataValues[i][0]) continue; // Skip baris kosong
    hasil.push({
      id: dataValues[i][0],
      nama: dataValues[i][1]
    });
  }
  return hasil;
}

/**
 * 6. CREATE KATEGORI: Tambah kategori baru ke sheet Kategori
 */
function tambahKategori(nama) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Kategori");
  
  var id = "CAT-" + new Date().getTime();
  sheet.appendRow([id, nama]);
  
  return { status: "success", message: "Kategori '" + nama + "' berhasil ditambahkan!" };
}

/**
 * 7. UPDATE KATEGORI: Ubah nama kategori berdasarkan ID
 */
function ubahKategori(id, namaBaru) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Kategori");
  var dataValues = sheet.getDataRange().getValues();
  
  for (var i = 1; i < dataValues.length; i++) {
    if (dataValues[i][0] === id) {
      sheet.getRange(i + 1, 2).setValue(namaBaru);
      return { status: "success", message: "Kategori berhasil diperbarui!" };
    }
  }
  return { status: "error", message: "ID Kategori tidak ditemukan" };
}

/**
 * 8. DELETE KATEGORI: Hapus kategori berdasarkan ID
 */
function hapusKategori(id) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Kategori");
  var dataValues = sheet.getDataRange().getValues();
  
  for (var i = 1; i < dataValues.length; i++) {
    if (dataValues[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Kategori berhasil dihapus!" };
    }
  }
  return { status: "error", message: "ID Kategori tidak ditemukan" };
}

/**
 * 9. READ ASET: Ambil semua data aset keuangan
 */
function ambilSemuaAset() {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Aset");
  var dataValues = sheet.getDataRange().getDisplayValues();
  
  var hasil = [];
  for (var i = 1; i < dataValues.length; i++) {
    if (!dataValues[i][0]) continue; // Skip baris kosong
    // Menghilangkan format rupiah jika ada untuk diconvert ke number di JS
    var irenStr = dataValues[i][1] ? String(dataValues[i][1]) : "";
    var aldoStr = dataValues[i][2] ? String(dataValues[i][2]) : "";
    var irenVal = Number(irenStr.replace(/[^0-9.-]+/g,"")) || 0;
    var aldoVal = Number(aldoStr.replace(/[^0-9.-]+/g,"")) || 0;
    hasil.push({
      nama: dataValues[i][0],
      iren: irenVal,
      aldo: aldoVal
    });
  }
  return hasil;
}

/**
 * 10. UPDATE ASET: Memperbarui nominal saldo aset
 */
function ubahAset(namaAset, irenVal, aldoVal) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Aset");
  var dataValues = sheet.getDataRange().getValues();
  
  for (var i = 1; i < dataValues.length; i++) {
    if (dataValues[i][0] === namaAset) {
      sheet.getRange(i + 1, 2).setValue(Number(irenVal));
      sheet.getRange(i + 1, 3).setValue(Number(aldoVal));
      return { status: "success", message: "Aset '" + namaAset + "' berhasil diperbarui!" };
    }
  }
  return { status: "error", message: "Aset tidak ditemukan" };
}

/**
 * 11. CREATE ASET: Menambahkan instrumen aset baru
 */
function tambahAset(namaAset, irenVal, aldoVal) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Aset");
  var dataValues = sheet.getDataRange().getValues();
  
  for (var i = 1; i < dataValues.length; i++) {
    if (dataValues[i][0] === namaAset) {
      sheet.getRange(i + 1, 2).setValue(Number(irenVal));
      sheet.getRange(i + 1, 3).setValue(Number(aldoVal));
      return { status: "success", message: "Aset '" + namaAset + "' berhasil diperbarui!" };
    }
  }
  
  sheet.appendRow([namaAset, Number(irenVal), Number(aldoVal)]);
  return { status: "success", message: "Aset '" + namaAset + "' berhasil ditambahkan!" };
}

/**
 * 12. DELETE ASET: Menghapus instrumen aset
 */
function hapusAset(namaAset) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Aset");
  var dataValues = sheet.getDataRange().getValues();
  
  for (var i = 1; i < dataValues.length; i++) {
    if (dataValues[i][0] === namaAset) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Aset berhasil dihapus!" };
    }
  }
  return { status: "error", message: "Aset tidak ditemukan" };
}

/**
 * 13. READ ANGGARAN: Mengambil data nominal anggaran dan menghitung realisasi bulanan
 */
function ambilSemuaAnggaran() {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Ambil semua kategori dari sheet Kategori
  var catSheet = ss.getSheetByName("Kategori");
  var catValues = catSheet.getDataRange().getValues();
  var categories = [];
  for (var i = 1; i < catValues.length; i++) {
    if (catValues[i][1]) {
      categories.push(catValues[i][1]);
    }
  }
  
  // Ambil semua setelan anggaran
  var angSheet = ss.getSheetByName("Anggaran");
  var angValues = angSheet.getDataRange().getValues();
  var budgetMap = {};
  for (var i = 1; i < angValues.length; i++) {
    var user = angValues[i][0];
    var cat = angValues[i][1];
    var nominal = Number(angValues[i][2]) || 0;
    budgetMap[user + "_" + cat] = nominal;
  }
  
  // Ambil semua transaksi pada bulan & tahun aktif saat ini
  var txSheet = ss.getSheetByName("Transaksi");
  var txValues = txSheet.getDataRange().getValues();
  
  var now = new Date();
  var currentYear = now.getFullYear();
  var currentMonth = now.getMonth(); // 0-indexed
  
  var txMap = {};
  for (var i = 1; i < txValues.length; i++) {
    var dateVal = txValues[i][1];
    var dateObj = null;
    if (dateVal instanceof Date) {
      dateObj = dateVal;
    } else if (typeof dateVal === "string" && dateVal.trim() !== "") {
      var parts = dateVal.split("/");
      if (parts.length === 3) {
        dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }
    
    if (dateObj && dateObj.getFullYear() === currentYear && dateObj.getMonth() === currentMonth) {
      var cat = txValues[i][2];
      var amount = Number(txValues[i][3]) || 0;
      var user = txValues[i][5];
      if (user && cat) {
        var key = user + "_" + cat;
        txMap[key] = (txMap[key] || 0) + amount;
      }
    }
  }
  
  var users = ["Aldo", "Iren"];
  var hasil = [];
  
  for (var u = 0; u < users.length; u++) {
    var user = users[u];
    for (var c = 0; c < categories.length; c++) {
      var cat = categories[c];
      var key = user + "_" + cat;
      var nominal = budgetMap[key] || 0;
      var realisasi = txMap[key] || 0;
      hasil.push({
        user: user,
        kategori: cat,
        anggaran: nominal,
        realisasi: realisasi
      });
    }
  }
  
  return hasil;
}

/**
 * 14. UPDATE ANGGARAN: Memperbarui nominal budget limit kategori
 */
function ubahAnggaran(user, kategori, nominal) {
  initDatabase();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Anggaran");
  var dataValues = sheet.getDataRange().getValues();
  
  for (var i = 1; i < dataValues.length; i++) {
    if (dataValues[i][0] === user && dataValues[i][1] === kategori) {
      sheet.getRange(i + 1, 3).setValue(Number(nominal));
      return { status: "success", message: "Anggaran " + kategori + " untuk " + user + " berhasil diperbarui!" };
    }
  }
  
  sheet.appendRow([user, kategori, Number(nominal)]);
  return { status: "success", message: "Anggaran " + kategori + " untuk " + user + " berhasil ditambahkan!" };
}

/**
 * Render aplikasi web secara dinamis menggunakan Template
 */
function doGet(e) {
  var page = e.parameter.page || 'index';
  var user = e.parameter.user || 'Aldo';
  
  var template = HtmlService.createTemplateFromFile(page);
  template.scriptUrl = ScriptApp.getService().getUrl();
  template.currentUser = user;
  
  return template.evaluate()
      .setTitle('Jurnal Keuangan Bersama')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
