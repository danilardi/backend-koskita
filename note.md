npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string,role:enum:{user,admin},phonenumber:string
sequelize model:generate --name Kos --attributes name:string,price:integer,stockKamar:integer,latitude:float,longitude:float,address:string
sequelize model:generate --name Facility --attributes name:string
sequelize model:generate --name ImageKosan --attributes name:string,kosanId:integer
sequelize model:generate --name Kamar --attributes kosanId:integer,userId:integer
sequelize model:generate --name KosanFacility --attributes kosanId:integer,facilityId:integer

sequelize migration:generate --name add-column-tanggalSewa-to-



