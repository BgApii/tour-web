# Laporan Testing V-Model PSI

Dokumen ini disusun berdasarkan pembacaan kode pada repository PSI, khususnya path Shared, Application, Infrastructure, WebApi, Client, dan BSUI yang menjadi ruang lingkup aplikasi. Format testing mengikuti model SDLC V-Model, sehingga setiap level desain memiliki pasangan level pengujian.

## Ruang Lingkup Kode

| Layer | Path yang Dibaca | Fokus Utama |
|---|---|---|
| Shared | `src/03.Shared/Audits`, `Documents`, `FileAttachments`, `FormDatas`, `FormDataValues`, `FormFieldOptions`, `FormFields`, `Forms`, `Menus`, `OptionTypes`, `Plants` | DTO request/response, konstanta, validasi FluentValidation, kontrak API |
| Application | `src/04.Application/Audits`, `Documents`, `FileAttachments`, `FormDatas`, `FormDataValues`, `FormFieldOptions`, `Forms`, `Menus`, `OptionTypes`, `Plants`, `Services/Persistence/IPSIDbContext.cs` | CQRS command/query handler, validasi bisnis, MediatR, akses data lewat `IPSIDbContext` |
| Infrastructure | `src/05.Infrastructure/Persistence/PSIDbContext.cs`, `src/05.Infrastructure/Persistence/SqlServer/Configuration` | EF Core DbContext, audit otomatis, soft delete, konfigurasi tabel dan relasi SQL Server |
| WebApi | `src/06.WebApi/Areas/V1/Controllers` | Routing API v1, model binding, pengiriman command/query ke MediatR, response file |
| Client | `src/07.Client/Services/BackEnd` | RestSharp client service untuk konsumsi WebApi |
| BSUI | `src/08.Bsui/Features`, `src/08.Bsui/Layouts` | Blazor UI, halaman fitur, layout, navigasi, dialog, tabel, form dinamis |

## Pemetaan V-Model

| Level Testing | Validasi terhadap | Tujuan |
|---|---|---|
| Unit Test | Module design dan unit kode | Memastikan validator, helper, handler kecil, service client, dan komponen UI bekerja sesuai aturan lokalnya |
| Integration Test | Component design dan kontrak antar layer | Memastikan Shared, Application, Infrastructure, WebApi, dan Client saling terhubung dengan benar |
| System Test | System design | Memastikan aplikasi berjalan end-to-end dari BSUI, Client, WebApi, Application, Infrastructure, database, dan storage |
| UAT | Business requirement | Memastikan alur kerja diterima user bisnis seperti admin master data, pembuat form, pengguna form, dan auditor |

## Artefak Test Eksisting

| Test Project | Path | Cakupan Saat Ini |
|---|---|---|
| Unit Test | `tests/01.UnitTests` | Extension method pada Shared, contohnya `StringExtensionsTests` dan `DescriptionAttributeExtensionsTests` |
| Integration Test | `tests/02.IntegrationTests` | Application handler dan persistence untuk menu ordering, aturan leaf menu, form, option type, form data value, dropdown, audit query |
| API/System Candidate | `tests/03.ApiTests` | Health check client terhadap backend |

## 1. Unit Test

| ID | Path | Unit/Komponen | Skenario Unit Test | Expected Result | Status/Artefak |
|---|---|---|---|---|---|
| UT-01 | `src/03.Shared/Audits` | `GetAuditsRequestValidator`, request/response audit | Validasi filter tanggal `From` dan `To`, termasuk `To >= From`, batas timestamp, dan request export berisi audit id | Request audit valid diterima, rentang tanggal salah ditolak dengan validation error | Direkomendasikan; sebagian cakupan query ada di `tests/02.IntegrationTests/Application/Audits` |
| UT-02 | `src/03.Shared/Documents` | `CreateDocumentRequestValidator`, `GetDocumentFileResponse`, konstanta document | Validasi title wajib, panjang maksimum title, file wajib, ukuran file lebih dari 0, dan content type file didukung | Hanya dokumen dengan metadata dan file valid yang lolos validasi | Direkomendasikan |
| UT-03 | `src/03.Shared/FileAttachments` | `CreateFileAttachmentRequestValidator`, `GetFileAttachmentFileResponse` | Validasi upload attachment untuk file null/kosong, content type tidak didukung, dan file valid | Upload attachment tidak valid ditolak sebelum masuk Application handler | Direkomendasikan |
| UT-04 | `src/03.Shared/FormDatas` | `CreateFormDataRequestValidator`, `DeleteFormDataRequest`, query request/response | Validasi `FormId` dan `MenuId` wajib untuk create, serta request delete membawa id yang valid | Request form data invalid menghasilkan validation error | Direkomendasikan |
| UT-05 | `src/03.Shared/FormDataValues` | `CreateFormDataValueRequestValidator`, `UpdateFormDataValueRequestValidator` | Validasi `FormDataId`, `FormFieldId`, `FormDataValueId`, maksimum `ValueText`, dan update minimal memiliki satu value | Request value kosong atau id kosong ditolak; request typed value valid diterima | Direkomendasikan; sebagian sudah diuji integrasi di `tests/02.IntegrationTests` |
| UT-06 | `src/03.Shared/FormFieldOptions` | `CreateFormFieldOptionRequestValidator`, `UpdateFormFieldOptionRequestValidator` | Validasi option label wajib, panjang maksimum, dan order tidak negatif | Option kosong, terlalu panjang, atau order negatif ditolak | Direkomendasikan |
| UT-07 | `src/03.Shared/FormFields` | `CreateFormFieldRequestValidator`, `UpdateFormFieldRequestValidator` | Validasi field label, enum `FieldType`, order, dan aturan `OptionTypeId` hanya boleh ada untuk `DropDown` | Dropdown tanpa `OptionTypeId` ditolak; field non-dropdown dengan `OptionTypeId` ditolak | Direkomendasikan |
| UT-08 | `src/03.Shared/Forms` | `CreateFormRequestValidator`, `UpdateFormRequestValidator` | Validasi form name, description, daftar fields wajib, dan nested validator field | Form tanpa field atau dengan field invalid ditolak | Direkomendasikan; skenario update sudah ada di integration test |
| UT-09 | `src/03.Shared/Menus` | `CreateMenuRequestValidator`, `UpdateMenuRequestValidator` | Validasi title, url, plant id, parent id optional, form id optional, dan order `>= 0` | Request menu invalid ditolak sebelum handler | Direkomendasikan |
| UT-10 | `src/03.Shared/OptionTypes` | `CreateOptionTypeRequestValidator`, `UpdateOptionTypeRequestValidator` | Validasi option type name, description, daftar option wajib, dan label option harus unik | Option type dengan label duplicate ditolak | Direkomendasikan; create option type sudah ada di integration test |
| UT-11 | `src/03.Shared/Plants` | `CreatePlantRequestValidator`, `UpdatePlantRequestValidator` | Validasi plant name dan plant code wajib, panjang maksimum, serta id wajib saat update | Request plant invalid menghasilkan validation error | Direkomendasikan |
| UT-12 | `src/04.Application/Menus` | `MenuOrderManager`, `CreateMenuCommandHandler`, `UpdateMenuCommandHandler`, `DeleteMenuCommandHandler` | Normalisasi urutan saat create/update/delete, parent tidak boleh menu yang punya form, menu dengan child tidak boleh diberi form, duplicate sibling title ditolak | Order sibling selalu 1..n, aturan leaf menu terjaga, relasi form data dibuat/dihapus sesuai menu | Sudah ada sebagian di `MenuOrderTests`, `MenuLeafFormRuleTests`, `MenuDeleteTests` |
| UT-13 | `src/04.Application/FormDataValues` | `FormDataValueValidationHelper`, create/update handler | Validasi satu field hanya memiliki satu value aktif, typed value sesuai `FieldType`, dropdown value harus ada di master option, file value butuh attachment valid | Field slot duplicate ditolak, value yang tidak sesuai tipe ditolak, dropdown invalid ditolak | Sudah ada sebagian di `FormDataDuplicateSubmissionTests`, `DropDownOptionValidationTests`, `FormDataValue*Tests` |
| UT-14 | `src/04.Application/Forms` | `CreateFormCommand`, `UpdateFormCommand`, handler form | Mapping request ke command, duplicate form name, option type harus ada untuk dropdown, update form diblokir jika sudah ada value | Form tersimpan dengan field order benar; update protected ketika data isian sudah ada | Sudah ada sebagian di `CreateFormTests`, `UpdateFormTests` |
| UT-15 | `src/04.Application/OptionTypes`, `src/04.Application/FormFieldOptions` | Create/update/delete option type handler | Duplicate option type name ditolak, order option default benar, update dapat tambah/edit/soft-delete option, delete diblokir saat masih dipakai form field | Option type dan options konsisten, tidak ada option aktif yang tertinggal tidak sesuai request | Direkomendasikan; create sudah ada sebagian |
| UT-16 | `src/04.Application/Plants` | Create/update/delete plant handler | Duplicate plant name/code ditolak, delete plant diblokir saat masih digunakan menu, response create mengembalikan id entity yang tersimpan | Plant valid tersimpan, konflik ditolak, id response cocok dengan data persistence | Direkomendasikan |
| UT-17 | `src/04.Application/Documents`, `src/04.Application/FileAttachments` | Create/get/delete document dan file attachment handler | File stream disalin ke storage, metadata file disimpan, read file mengembalikan content/type/name, delete document soft delete | Storage dipanggil dengan byte yang benar dan response metadata sesuai | Direkomendasikan |
| UT-18 | `src/04.Application/Audits` | Get audit, get audits, export audit handler | Filter audit, pagination, detail audit, export CSV dengan content type dan nama file yang benar | Query menghasilkan data sesuai filter dan export menghasilkan file CSV valid | Sudah ada sebagian di `GetAuditsTests`; export direkomendasikan |
| UT-19 | `src/04.Application/Services/Persistence/IPSIDbContext.cs` | Kontrak `IPSIDbContext` | Semua `DbSet` yang dipakai handler tersedia: Audits, Plants, Menus, Forms, OptionTypes, Documents, FormDatas, FormDataValues, FormFields, FormFieldOptions, FileAttachments | Handler dapat diuji dengan fake/in-memory context tanpa kehilangan entity yang dibutuhkan | Direkomendasikan sebagai compile-time contract test |
| UT-20 | `src/05.Infrastructure/Persistence/PSIDbContext.cs` | `SaveChangesAsync<THandler>`, audit builder, domain event dispatch | Entity Added mengisi Created/CreatedBy, Modified mengisi Modified/ModifiedBy, soft delete membuat audit `SoftDeleted`, domain event dipublish setelah save | Audit dan metadata user/geolocation terbentuk konsisten | Direkomendasikan; bisa memakai SQLite in-memory atau provider test |
| UT-21 | `src/05.Infrastructure/Persistence/SqlServer/Configuration` | EF Core configuration classes | Verifikasi table name, schema, max length, value generated never, relationship, dan `DeleteBehavior.Restrict` | Model metadata sesuai kontrak database SQL Server | Direkomendasikan sebagai model metadata test |
| UT-22 | `src/07.Client/Services/BackEnd` | `AuditService`, `DocumentService`, `FileAttachmentService`, `FormService`, `FormDataService`, `FormDataValuesService`, `MenuService`, `OptionTypeService`, `PlantService` | Setiap service membentuk method HTTP, route, query parameter, body JSON/form, multipart, dan parsing response dengan benar | Request client sama dengan kontrak WebApi dan error response terbaca sebagai `ResponseResult` | Direkomendasikan; dapat memakai mock `IRestClient`/test handler |
| UT-23 | `src/08.Bsui/Features`, `src/08.Bsui/Layouts` | Blazor component code-behind dan layout | Test state table reload, search, dialog create/update/delete, submit form, error viewer, nav menu, `MainLayout` authorization/geolocation | Komponen memanggil service yang benar dan menampilkan state sukses/error sesuai response | Direkomendasikan dengan bUnit dan mocked services |

## 2. Integration Test

| ID | Path | Integrasi yang Diuji | Skenario Integration Test | Expected Result | Status/Artefak |
|---|---|---|---|---|---|
| IT-01 | `src/03.Shared/*` + `src/04.Application/*` | FluentValidation pipeline dan MediatR | Kirim command/query invalid melalui `ISender` untuk plant, menu, form, option type, document, file attachment, dan form data value | Validation behavior menolak request sebelum handler melakukan perubahan database | Direkomendasikan |
| IT-02 | `src/04.Application/Plants` + `src/05.Infrastructure/Persistence` | Plant handler dengan SQL Server context | Create plant, update plant, duplicate name/code, delete plant kosong, delete plant yang masih dipakai menu | Data plant tersimpan/terubah/soft-deleted sesuai aturan; konflik bisnis menghasilkan exception | Direkomendasikan |
| IT-03 | `src/04.Application/OptionTypes`, `FormFieldOptions` + `src/05.Infrastructure/Persistence/SqlServer/Configuration` | Option type dan option item persistence | Create option type dengan beberapa option, update tambah/edit/hapus option, delete option type yang belum dan sudah dipakai form field | Relasi option type-option item konsisten, delete diblokir saat masih dipakai | Sebagian ada di `CreateOptionTypeTests` |
| IT-04 | `src/04.Application/Forms`, `FormFields`, `OptionTypes` + `IPSIDbContext` | Form builder dan field dropdown | Create form dengan field text, textarea, number, date, file, dropdown; dropdown harus memakai option type aktif; update form tanpa data; update form dengan data | Form dan field tersimpan dengan order benar; option type tidak ada ditolak; update diblokir bila sudah ada form data value | Sebagian ada di `CreateFormTests`, `UpdateFormTests` |
| IT-05 | `src/04.Application/Menus`, `Forms`, `FormDatas`, `Plants` + persistence | Menu hierarchy dan relasi form | Create parent/child menu, attach form hanya pada leaf menu, auto-create `FormData`, pindah parent/plant, delete menu kosong, delete menu yang punya child/value | Aturan leaf menu terpenuhi, form data aktif mengikuti menu, order sibling dinormalisasi | Sudah ada di `MenuOrderTests`, `MenuLeafFormRuleTests`, `MenuDeleteTests` |
| IT-06 | `src/04.Application/FormDatas`, `FormDataValues`, `FileAttachments` + persistence | Pengisian form dinamis | Create form data, isi value text/textarea/number/date/dropdown/file, update value, delete value, cegah value ganda pada field yang sama | Hanya value sesuai tipe field yang tersimpan, dropdown valid dari option master, field slot duplicate ditolak | Sudah ada sebagian di `FormDataValue*Tests`, `DropDownOptionValidationTests`, `FormDataDuplicateSubmissionTests` |
| IT-07 | `src/04.Application/Documents`, `FileAttachments` + storage service + persistence | Upload, download, dan delete file | Upload document/attachment, baca ulang dari storage, delete document, replace attachment pada form data value | Metadata database dan content storage sinkron; attachment lama soft-deleted saat diganti | Direkomendasikan |
| IT-08 | `src/05.Infrastructure/Persistence/PSIDbContext.cs` + `SqlServer/Configuration` | Audit otomatis dan konfigurasi EF | Jalankan command create/update/delete pada entity auditable, lalu query `Audits`; verifikasi tabel, schema, relasi restrict, max length | Audit berisi table, entity, action name, old/new values, user, ip, geolocation; constraint database aktif | Sebagian ada di `GetAuditsTests`; audit save direkomendasikan |
| IT-09 | `src/04.Application/Audits` + `src/05.Infrastructure/Persistence` | Query dan export audit | Seed beberapa audit, query dengan keyword/tanggal/pagination, export beberapa id ke CSV | Hasil query sesuai filter dan export menghasilkan CSV dengan content type `text/csv` | Query ada sebagian; export direkomendasikan |
| IT-10 | `src/06.WebApi/Areas/V1/Controllers` + `src/04.Application` | Controller, model binding, dan MediatR | Hit endpoint GET/POST/PUT/DELETE untuk Audits, Documents, FileAttachments, FormDatas, FormDataValues, Forms, Menus, OptionTypes, Plants | Controller memetakan route/body/form/query ke command/query dan mengembalikan status code sesuai hasil handler | Direkomendasikan sebagai API integration test |
| IT-11 | `src/06.WebApi/Areas/V1/Controllers` + file response extension | Download document, file attachment, dan export audit melalui HTTP | Endpoint file mengembalikan content, content type, dan file name benar | Browser/client dapat download atau open file tanpa kehilangan metadata | Direkomendasikan |
| IT-12 | `src/07.Client/Services/BackEnd` + WebApi test server | Client BackEnd service terhadap API | Panggil `PlantService`, `MenuService`, `FormService`, `OptionTypeService`, `DocumentService`, `FileAttachmentService`, `AuditService`, `FormDataService`, `FormDataValuesService` ke TestServer | Client menghasilkan request sesuai route API v1 dan parsing sukses/error benar | Direkomendasikan |
| IT-13 | `src/08.Bsui/Features` + `src/07.Client/Services/BackEnd` | Integrasi komponen BSUI dengan service client | Render halaman index/detail/create/update dengan service fake, submit dialog, reload table, search, pagination, dan error response | UI state berubah sesuai response service tanpa butuh browser penuh | Direkomendasikan dengan bUnit |
| IT-14 | `src/08.Bsui/Layouts` + authorization/geolocation service | Layout, navigation, dan authorization shell | Render `MainLayout` dan `NavMenu` untuk user authorized/unauthorized, posisi aktif, menu dinamis dari backend | Menu tampil sesuai data dan role; unauthorized diarahkan ke halaman yang benar | Direkomendasikan |

## 3. System Test

| ID | Path | Alur Sistem | Langkah System Test | Expected Result |
|---|---|---|---|---|
| ST-01 | `src/06.WebApi`, `src/05.Infrastructure`, `tests/03.ApiTests` | Health check dan kesiapan backend | Jalankan WebApi dengan konfigurasi test, panggil health check melalui client | Status backend dan dependency utama `Healthy` |
| ST-02 | `src/08.Bsui/Layouts`, `src/08.Bsui/Services/Authentication`, `src/08.Bsui/Services/Authorization` | Login, layout, dan akses aplikasi | Buka aplikasi BSUI, login atau pakai auth provider test, verifikasi `MainLayout`, `NavMenu`, account info, dan halaman forbidden/unauthorized | User authorized melihat menu dan konten; user tanpa akses diarahkan ke error page yang tepat |
| ST-03 | `src/08.Bsui/Features/Plants`, `src/07.Client/Services/BackEnd/PlantService.cs`, `src/06.WebApi/Areas/V1/Controllers/PlantsController.cs`, `src/04.Application/Plants` | Master data Plant | Dari UI buka halaman Plants, create, search, lihat detail, update, delete plant yang tidak dipakai, dan coba delete plant yang masih dipakai menu | CRUD sukses sesuai aturan; delete yang melanggar relasi ditolak dengan pesan error |
| ST-04 | `src/08.Bsui/Features/OptionTypes`, `src/07.Client/Services/BackEnd/OptionTypeService.cs`, `src/04.Application/OptionTypes` | Master Option Type | Buat option type dengan beberapa option, update label/order, hapus option type, dan coba hapus saat sudah dipakai field dropdown | Option master dapat dipakai form; option type yang masih dipakai tidak bisa dihapus |
| ST-05 | `src/08.Bsui/Features/Forms`, `src/07.Client/Services/BackEnd/FormService.cs`, `src/04.Application/Forms` | Form builder dinamis | Buat form dengan field text, textarea, number, date, dropdown, file; update form sebelum ada data; coba update setelah ada data isian | Form tersimpan dan tampil detail; update diblokir setelah form memiliki data isian aktif |
| ST-06 | `src/08.Bsui/Features/Menus`, `src/08.Bsui/Layouts/NavMenu.razor*`, `src/04.Application/Menus` | Menu management dan navigasi | Buat menu parent/child per plant, atur order, attach form ke leaf menu, refresh nav, pindah menu, delete menu | Navigasi mengikuti data menu, order stabil, form hanya bisa pada leaf menu |
| ST-07 | `src/08.Bsui/Features/MenuPages`, `src/07.Client/Services/BackEnd/FormDatasService.cs`, `FormDataValuesService.cs`, `FileAttachmentService.cs` | Pengisian business form | Akses menu bisnis dynamic route `/{*MenuPath}`, buat entry baru, isi semua tipe field, edit entry, search result, delete entry kosong | Data tersimpan per menu/form, result table menampilkan value yang tepat, validasi field bekerja |
| ST-08 | `src/08.Bsui/Features/MenuPages/Components/DialogFormDataEditor.razor*`, `src/04.Application/FileAttachments` | File field pada form dinamis | Upload file pada field bertipe file, simpan form data, open file, download file, ganti file, hapus value file | File dapat dibuka/download; attachment lama tidak aktif setelah diganti |
| ST-09 | `src/08.Bsui/Features/Documents`, `src/07.Client/Services/BackEnd/DocumentService.cs`, `src/06.WebApi/Areas/V1/Controllers/DocumentsController.cs` | Document repository | Upload dokumen, lihat list, search, download, delete dokumen | Dokumen tampil di UI, file download sesuai metadata, dokumen deleted tidak muncul lagi |
| ST-10 | `src/08.Bsui/Features/Audits`, `src/07.Client/Services/BackEnd/AuditService.cs`, `src/04.Application/Audits` | Audit monitoring | Lakukan create/update/delete data master, buka audit list, filter tanggal/keyword, buka detail, export audit CSV | Aktivitas terekam, filter benar, detail old/new value terbaca, export CSV berhasil |
| ST-11 | `src/06.WebApi/Areas/V1/Controllers`, `src/07.Client/Services/BackEnd`, `src/08.Bsui/Common/Components` | Error handling end-to-end | Kirim input invalid dari UI dan API, simulasi 400/401/403/404/500/service unavailable | API mengembalikan response standar, client memetakan error, UI menampilkan error viewer atau page yang sesuai |
| ST-12 | `src/05.Infrastructure/Persistence/SqlServer/Configuration`, `src/05.Infrastructure/Persistence/PSIDbContext.cs` | Data integrity setelah alur sistem | Setelah alur ST-03 sampai ST-10, verifikasi database: tidak ada active orphan data, relasi restrict bekerja, audit terbentuk | Database konsisten dan data soft delete tidak muncul di flow aktif |

## 4. User Acceptance Test (UAT)

| ID | Aktor | Path Fitur | Skenario UAT | Kriteria Penerimaan |
|---|---|---|---|---|
| UAT-01 | Admin Master Data | `src/08.Bsui/Features/Plants` | Admin membuat, mencari, mengubah, dan menghapus Plant | Plant baru langsung tersedia untuk menu; duplicate name/code ditolak; plant yang sudah dipakai menu tidak bisa dihapus |
| UAT-02 | Admin Master Data | `src/08.Bsui/Features/OptionTypes` | Admin membuat master pilihan dropdown seperti status approval, menambah/mengubah/menghapus item option | Option type dapat dipilih saat membuat form dropdown; label duplicate ditolak; option type yang sudah dipakai tidak bisa dihapus |
| UAT-03 | Form Designer/Admin | `src/08.Bsui/Features/Forms` | Admin membuat form dinamis dengan field text, textarea, number, date, dropdown, dan file | Form muncul pada list/detail, setiap field tampil dengan order benar, dropdown memakai option master yang dipilih |
| UAT-04 | Form Designer/Admin | `src/08.Bsui/Features/Forms` | Admin mencoba mengubah struktur form yang sudah memiliki data isian | Sistem menolak perubahan struktur untuk mencegah rusaknya data historis |
| UAT-05 | Admin Menu | `src/08.Bsui/Features/Menus`, `src/08.Bsui/Layouts/NavMenu.razor*` | Admin menyusun menu per plant, membuat parent/child, mengatur order, dan menautkan form ke leaf menu | Menu tampil pada navigasi dengan urutan benar; form hanya bisa ditautkan pada menu tanpa submenu |
| UAT-06 | User Bisnis | `src/08.Bsui/Features/MenuPages` | User membuka menu bisnis dan mengisi form dinamis | User dapat menyimpan data dengan semua tipe field; validasi wajib/tipe muncul saat input tidak sesuai |
| UAT-07 | User Bisnis | `src/08.Bsui/Features/MenuPages`, `src/08.Bsui/Features/MenuPages/Components/DialogFormDataEditor.razor*` | User mengedit data form yang sudah tersimpan, mengganti file, dan melihat hasil pada result table | Perubahan tersimpan, result table refresh, file baru dapat dibuka/download, data lama tidak tertukar |
| UAT-08 | User Bisnis/Admin | `src/08.Bsui/Features/Documents` | User mengunggah dokumen pendukung, mencari dokumen, download dokumen, dan menghapus dokumen | Dokumen dapat dikelola dari UI, file yang didownload sama dengan file yang diupload, dokumen deleted tidak tampil |
| UAT-09 | Auditor/Admin | `src/08.Bsui/Features/Audits` | Auditor melihat riwayat perubahan data, memfilter audit, membuka detail, dan export CSV | Audit menampilkan aktor, waktu, action, old/new values, dan export dapat digunakan sebagai lampiran laporan |
| UAT-10 | User dengan akses terbatas | `src/08.Bsui/Layouts`, `src/08.Bsui/Common/Pages/Errors` | User tanpa permission mencoba membuka halaman master data atau audit | Sistem menampilkan forbidden/unauthorized page dan tidak menampilkan aksi yang tidak boleh dilakukan |
| UAT-11 | Semua user | `src/08.Bsui/Layouts/MainLayout.razor*`, `src/08.Bsui/Common/Components` | User menggunakan aplikasi dengan jaringan/API bermasalah atau input invalid | UI memberi feedback loading/error yang jelas dan tidak kehilangan state penting |

## Perintah Eksekusi Test yang Disarankan

| Level | Command |
|---|---|
| Unit Test | `dotnet test tests/01.UnitTests/01.UnitTests.csproj` |
| Integration Test | `dotnet test tests/02.IntegrationTests/02.IntegrationTests.csproj` |
| API/System Candidate | `dotnet test tests/03.ApiTests/03.ApiTests.csproj` |
| Semua test project | `dotnet test PSI.slnx` |

## Catatan Prioritas Coverage

| Prioritas | Area | Alasan |
|---|---|---|
| Tinggi | `src/04.Application/FormDataValues`, `src/08.Bsui/Features/MenuPages` | Form dinamis adalah alur utama user dan memiliki banyak variasi tipe data |
| Tinggi | `src/04.Application/Menus`, `src/08.Bsui/Features/Menus`, `src/08.Bsui/Layouts/NavMenu.razor*` | Menu menentukan navigasi dan relasi form, plant, parent-child, serta order |
| Tinggi | `src/05.Infrastructure/Persistence/PSIDbContext.cs` | Audit otomatis dan soft delete berpengaruh ke seluruh modul |
| Sedang | `src/04.Application/Documents`, `src/04.Application/FileAttachments`, `src/07.Client/Services/BackEnd` | Risiko pada upload/download file, storage, dan parsing response |
| Sedang | `src/06.WebApi/Areas/V1/Controllers` | Perlu menjaga kontrak API untuk client dan BSUI |
| Sedang | `src/03.Shared/*` validator | Validator adalah gerbang awal agar data invalid tidak masuk ke Application |
