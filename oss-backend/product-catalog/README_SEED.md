This file explains how to import the product-catalog seed data into MySQL and start the backend.

Prerequisites
- MySQL server running locally (default port 3306)
- MySQL client (`mysql`) in PATH
- Java + Maven (for Spring Boot) or use IDE

1) Import the seed SQL (creates DB and data)

Open a terminal (PowerShell / CMD on Windows) and run:

mysql -u root -p < "product-catalog/seed.sql"

Enter your MySQL `root` password when prompted. This will create the `Training` database and all tables + seed rows.

Alternative: log into mysql first and source the file:

mysql -u root -p
# then inside mysql prompt:
SOURCE product-catalog/seed.sql;

2) Verify data (example queries)

# List products
mysql -u root -p -e "USE Training; SELECT id,sku,name,brand,price,stock,availability_status FROM products LIMIT 20;"

# Categories with counts
mysql -u root -p -e "USE Training; SELECT c.id,c.name,COUNT(pc.product_id) AS product_count FROM categories c LEFT JOIN product_categories pc ON c.id=pc.category_id GROUP BY c.id;"

# Get product with sku
mysql -u root -p -e "USE Training; SELECT * FROM products WHERE sku='SKU-APL-IP15PM' LIMIT 1;"

# Average rating for a product (replace SKU)
mysql -u root -p -e "USE Training; SELECT AVG(r.rating) AS avg_rating, COUNT(*) AS review_count FROM reviews r JOIN products p ON r.product_id=p.id WHERE p.sku='SKU-APL-IP15PM';"

3) Start the backend (from workspace root)

cd product-catalog
# On Windows use the wrapper script
mvnw.cmd spring-boot:run
# or if you have mvn installed:
mvn spring-boot:run

The app uses application.properties in `src/main/resources` pointing to `jdbc:mysql://localhost:3306/Training`. If your MySQL credentials differ, update that file before starting.

4) Start the frontend (oss-frontend)

cd ../oss-frontend
npm install
# start dev server (project may use Vite/Angular tooling)
npm run dev
# or
npm start

Notes
- If your MySQL user is not `root` or the password differs, edit `product-catalog/src/main/resources/application.properties` to match.
- The seed inserts image rows with NULL `image_data`. You can later upload binary images via the API or replace `NULL` with LOAD_FILE(...) if files are accessible to MySQL server.

If you want, I can also add a `docker-compose.yml` to run a MySQL container and import the seed automatically—shall I add that?