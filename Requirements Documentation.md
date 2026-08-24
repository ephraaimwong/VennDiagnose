Revision History

| Name                                      | Date       | Reason for Changes | Version |
| ----------------------------------------- | ---------- | ------------------ | ------- |
| First Draft of Requirements Documentation | 08/24/2026 | Initial Draft      | 1       |
Table of Contents
1. Overview
2. Organization Requirements
	1. Background
	2. Opportunity
	3. Objectives
	4. Success Metrics
	5. Product Vision Statement
2. Scope & Limitations
	1. Major Features
	2. Project Scope
	3. Limitations & Exclusions
3. Context Descriptions
	1. User Classes & Characteristics
	2. Operating Environment
	3. Design & Implementation Constraints
	4. Assumptions & Dependencies
	5. Glossary of Terms
4. System Features
	1. Feature 1
	2. Feature 2
5. External Interface Requirements
	1. User Interface
	2. Hardware Interface
	3. Software Interface
	4. Communication Interface
6. Software Quality Attributes
	1. Performance Requirements
	2. Maintainability Requirements
	3. Availability Requirements
	4. Other SQA Requirements
## 1. Overview
VennDiagnose is designed to be a user-friendly, GUI first module that allows users to visually graph and manipulate their financial budgets. 
## 2. Organization Requirements
### 2.1 Background
Current industry offerings are simple pie charts with extremely restrictive rule sets. (I.e Chase budget planner)

### 2.2 Opportunity
There is lack of graphic first fine grained tooling in the financial sector targeted towards Pro-sumers (Intermediate to Advanced Retail consumers).

### 2.3 Objectives
- Drag and Drop visual elements
- User friendly element manipulation
- 2 way budget manipulation (drag drop v. typing into table)
### 2.4 Success Metrics
- Elimination of edge cases
- Ability to support up to 100 elements (entries and sets)
- Future Dev: Have a mobile version of the module (will likely be completely different due to HCI differences of computer and mobiles)
### 2.5 Product Vision Statement
For {users} who have {need}, {product name} is a {product type} that provides {key benefits and unique value} unlike {current industry offerings}
## 3. Scope & Limitations
### 3.1 Major Features
- Interactable Scene
- Tables with live set membership
- Adhoc Table generation for Set intersection and shared points
- Data Manipulation via table & dragging elements
### 3.2 Project Scope
VennDiagnose is not meant to be a standalone product but instead a core module within a larger system. This necessarily dictates that VennDiagnose must be developed to read/write to a database which the larger system has access to.
### 3.3 Limitations & Exclusions
Development will be limited to the exhaustive list of features and system interactions detailed within this requirements documentation.

## 4. Context Description
### 4.1 User Classes & Characteristics
The product has 2 main user classes. Primary is consumer. Consumers require extremely user-friendly features with intense HCI considerations, there is an expectation that consumers may have zero technical expertise. Clear labels must be included on every interface element with high visibility techniques implemented to draw user attention to the important actions. 
Secondary is developer. There should be enough debugging capabilities for dev team to bug fix and diagnose problems quickly.

### 4.2 Operating Environment
React web app that read/write from database to store user settings.

## 5. System Features
### 5.1 Interactable Scene
**Priority:** HIGH
**Description:** The web app needs to host a scene which supports SVG generation and movement. Users must be able to cursor lasso elements, drag groups and de-select items. 
![Scene Mock](Scene%20Mock.svg)
**Functional Requirements:**
### 5.2 Tables with Live Set Membership
**Priority:** HIGH
**Description:** There should be tables in close proximity to the scene which provides a listed representation of the diagram. These tables should be updated when elements are moved, begin movement and end movement.  
**Functional Requirements:**
![Scene Mock Table](Scene%20Mock%20Table.svg)

### 5.3 Adhoc Table generation for Set intersection and shared points
**Priority:** MEDIUM
**Description:** 

![Scene Mock Adhoc Table](Scene%20Mock%20Adhoc%20Table.svg)

### 5.4 Data Manipulation via table & dragging elements
**Priority:** MEDIUM
**Description:** The diagram should update when user selects and drags elements. The diagram should also redraw points if user modifies i.e point A to belong to Set 2 in the table.

