# Gunakan image Node.js LTS
FROM node:18

# Menetapkan direktori kerja di dalam container
WORKDIR /app

# Menyalin file package.json dan package-lock.json
COPY package*.json ./

# Menginstal dependensi
RUN npm install

RUN npm install -g nodemon


# Menyalin seluruh kode sumber ke dalam container
COPY . .

RUN npx prisma generate

# Mengekspose port yang digunakan oleh aplikasi (port 5000)
EXPOSE 5500

# Menjalankan aplikasi
CMD ["nodemon", "--legacy-watch", "src/main.js"]
