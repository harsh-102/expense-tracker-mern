# Final Prompt :

I want you to build a robust fully working full stack project \*Business expense tracker\* specifically an employee Expense and Reimbursement tracker using MERN stack. (Similar to sap concur expense). It should have a well defined database with detailed collections and a clean professional UI.  
Use the following colour scheme: HEX: 472950 , C0A4C4 , D46A79 , F6CBB6 , 78201B.

#  Major components : 

1. Use react \+ vite for frontend and build a Modern interactive UI . The website should have a home page with components like \- Platform , solution , customers , resources, company which can be accessed through navigation bar on the top or on scrolling. Should also have a header and footer, Sign in and login options that will navigate to sing in and login pages. 

## Frontend (React)

### Main UI Components

* Home page  
* Login / Signup pages  
* Dashboard (Slightly Different For each level of employee)  
* Create Report (Set report name , set start data , finish date , employee id)  
* Add Expense form   
* Expense List / Table  
* Expense Details / Edit Expense  
* Reports & Analytics (charts)  
* Settings / Profile page  
* Reports page 

### Frontend Responsibilities

* Form validation (amount, date, category, etc.)  
* Showing charts & summaries  
* Filtering and sorting expenses  
* Calling backend APIs (using Axios / Fetch)  
* Managing state (Context API / Redux)

2. Use express and node js for backend server and handle all cases and apis efficiently.

## Backend (Node.js \+ Express)

Handles business logic and APIs.

### Backend Responsibilities

* Authentication & authorization  
* Expense CRUD operations  
* Category management  
* Report generation logic  
* Role-based access (admin / manger / employee)

3. Use mongoDB for the database. Use mongoose as a db driver. I need the database and server to be running locally at first. 

## Database (MongoDB)

Stores all application data.

### Collections (Add or remove as required)

* Users  
* Expenses  
* Categories  
* Businesses / Companies   
* Roles / Permissions

##  Authentication & Security

* JWT-based authentication  
* Password hashing (bcrypt)  
* Role-based access control  
* Protected routes (frontend \+ backend)

# Overview : 

We will help a business track all expenses related to employees. The website can be used by multiple businesses/companies. Within a company there will be 3 roles \- Admin (Business Owner / Finance Head) , Manager, Employee.  
The Company owner/Finance head/Admin will first create a company account and add other employees. The "Signup page" is exclusively for new Business Admins to register a company, while standard employees only use the "Login page" after being invited.

### Logic flowchart:

 Admin creates company  
↓  
Admin creates employees & managers (Adds \- Name , email , role , manager\_id, employee\_id)  
↓  
Employees receive login access  
↓  
Employees set password / activate account  
↓  
Employees start using system

#### Example of a user created by the system when admin adds a member:  {

  "name": "Rahul",  
  "email": "rahul@gmail.com",  
  "role": “employee”,  
  “employee\_id”: “22”,  
  “manager\_id”:”4”,  
  "company": "ABC Pvt Ltd",  
  "password": null,  
  "isActive": false  
}

Then Employee logs in with email  
Clicks “Set Password”  
Account activated.  Employee logs in Now \- Can login normally , Access dashboard , Create and Submit expenses.   
Role Assignment (Key Concept) \- When an admin creates a user, role: "employee"  or “manager" is set by the admin. This determines what dashboard they see and what actions they can perform.

### Expense and report : 

\*Expense\*   
will be the amount of money used for the purpose of business related queries or work.

\*How will the expense be generated?\*   
When managers and employees will be using their own money for business related work , they will add the expense to the report. If the expense report has been approved then the one who created this expense report will get reimbursement equal to the total amount of that monthly expense report.

\*Characteristics of expense:\*  
Employees will create a monthly report (Report will not be visible to manager until submitted). Each report will contain Expenses : Each expense will have Different features   
Example : Category/Type , date , invoice , bill image , gst no(For hotel night stay) , type of fule, odometer start/ end reading (For fuel Expense) , etc. 

 \*Who can generate expense:\* Each working entity whether Admin, Manager or Employee can have their own expenses which can be added to the report.

\*Category of expense:\* There needs to be multiple categories to which an expense can belong . Example : Hotel stay, food expense , stationary, fuel, Toll tax, Business related meeting food / venue , travelling cost etc. After the user will create a report , they will add expense to the report, they will select the category , and fill in details required in that category.

\*Information in each Category:\* Each category will have different type of information   
Example : “Hotel Night Stay"category we will have \- Date , Hotel name, Hotel GST number, invoice no., number of nights, state, Amount , Gst percentage ,etc. Each entry will require the user to attach a photo of the bill for verification.

\*Approval of expense\*: There is a hierarchy in business \- admin then manager then employee. There can be multiple managers and employees.  
Employee’s expense report will go to their assigned manager for approval , when manager approves then it will go to the admin (Two-level approval). The manager's expense report will go to the admin.   
Status of an Expense report can be of following types:   
status: \[  
"pending",  // employee submitted  
"manager\_approved",  
"manager\_rejected",  
"admin\_approved",  
“admin\_rejected”,  
“reimbursed”  
\]  
When someone (manager or admin) sends back an expense report there will be an option for adding comments on a specific entry to specify what needs to be changed or removed. The employee can make the changes and submit again. Ensure the Database schema for Expenses includes an array or field for comments or rejection\_reason so these notes persist in the database and can be displayed to the employee.

 \*Category limit:\* The admin will have the option to set a maximum amount limit per day for different categories of expense if needed. No limit by default. If a limit is set and the employee tries to enter an amount exceeding the limit they will get a warning saying “The Amount Exceeds the set limit for this Expense type”.  The expense will have a warning tag attached but should still be allowed to submit.  
	  
\*Admin:\*  
Who they are: Business owner or finance/admin team,  
Permissions:  
	i) Full access to all submitted expenses/Reports  
	ii) Approve/ reject any expense   
	iii) View company \-wide analytics   
	iv) Manage categories  
	v) Set spending limits  
	vi) Create/edit users  
	vii) Assign roles( manager/ employees)  
	viii) Export reports ( PDF/CSV)  
There has to be an admin in a business without admin there will be no manager or employee.  
All users making reports to keep track of expenses can see at the end of the month what percent of money is being used in which category.  
 Analytics & Reports

* Monthly expense reports can be submitted by members of all 3 roles   
* Category-wise pie chart for each report  
* Daily / weekly spending trends   
* Export reports (PDF / CSV)

