**ID** (id)

**Name** (name)

**Summary title** (p3_summary_title)

**Summary address** (p3_summary_address)

**Subject** (Name + SEO stuff) (p3_subject)

**Person capacity** (person_capacity)

**Star rating** (star_rating)

**Tier ID** (tier_id)

**Room and property type** ()

**Room type category** (room_and_property_type)  
- 'Private room in house'  
- 'Private room in apartment'  
- 'Private room in bed and breakfast'  
- 'Entire apartment'  
- 'Entire townhouse'  
- 'Entire condominium'  
- 'Entire house'  
- 'Private room in condominium'  
- 'Private room in townhouse'  
- 'Entire cabin'  
- 'Entire serviced apartment'  
- 'Entire loft'  
- 'Entire guesthouse'  
- 'Private room in guest suite'  
- 'Private room in loft'  
- 'Entire bungalow'  
- 'Shared room in apartment'  
- 'Entire villa'  
- 'Room in hotel'  
- 'Private room in villa'  
- 'Entire place'  
- 'Entire bed and breakfast'  
- 'Private room'  
- 'Entire cottage'  
- 'Boat'  
- 'Entire chalet'  
- 'Room in boutique hotel'  
- 'Private room in serviced apartment'  
- 'Houseboat'  
- 'Entire guest suite'  
- 'Private room in guesthouse'  
- 'Camper/RV'  
- 'Shared room in house'  
- 'Private room in bungalow'  
- 'Private room in tiny house'  
- 'Shared room in townhouse'  

**Booking URL** ()  
**Last updated** ()  
**Minimum nights** ()  
**Native currency** ()  
**Author type** ()  

**Bathroom count label** (number + noun)  
**Bed count label** (number + noun)  
**Bedroom count label** (number + noun)  
**Guest count label** (number + noun)  

**Has WeWork location** (has_we_work_location)  
**Business travel ready** (is_business_travel_ready)  

**Listing amenities** (listing_amenities)  
- **Amenity** (1 or more)  
	- **ID** (listing_amenities.id)  
	- **Name** (listing_amenities.name)  
	- **Icon** (listing_amenities.icon)	 	
	- **Is present:** true / false (listing_amenities.is_present)  
**Is a Business Ready feature:** true / false (listing_amenities.is_business_ready_feature)  
- **Is a safety feature:** true / false (is_present)  
- **Tag** (listing_amenities.tag)  
- **List view photo**  (optional)(listing_amenities.select_list_view_photo)  
- **Tile view photo** (optional) (listing_amenities.select_tile_view_photo)  
- **Category** (optional) (listing_amenities.category)  
- **Tooltip** (optional) (listing_amenities.tooltip)  

**Root amenity sections** (root_amenity_sections)  
- **Amenity section** (1 or more)  
  - **ID** (root_amenity_sections.id)  
	- **Title** (root_amenity_sections.title)  
	- **Subtitle** (optional) (root_amenity_sections.subtitle)  
	- **Amenity IDs** (1 or more) (root_amenity_sections.amenity_ids)  

**All amenity sections** (see_all_amenity_sections)  
- **Amenity section** (1 or more)  
	- **ID** (see_all_amenity_sections.id)  
	- **Title** (see_all_amenity_sections.title)  
	- **Subtitle** (optional) (see_all_amenity_sections.subtitle)  
	- **Amenity IDs** (1 or more) (see_all_amenity_sections.amenity_ids)  

**Additional house rules** (text) (additional_house_rules)  

**Highlights** (highlights)  
**Highlight** (1 or more)  
**Type** (highlights.type)  
**Message** (highlights.message)  
**Headline** (highlights.headline)  
**Position** (highlights.position)  
**Vote** (optional) (highlights.vote)  

**Expectations**  (listing_expectations)  
- **Expectation**  (1 or more)  
  - **Title**   
	- **Type**  
	- **Added details**  (optional)  
**Rooms**  
- **Room** (0 or more)  
	- **ID**  
	- **Room number**  
	- **Beds** (1 or more)  
		- **ID** (Room ID + Bed type)  
		- **Quantity**  
		- **Type**  

**Primary host** (primary_host)  
**About** (text) (primary_host.about)  
**Badges** (primary_host.badges)  
**ID**   
**Count**  
**Host name** (primary_host.host_name)  
**Smart name** (primary_host.smart_name)  
**ID** (primary_host.id)  
**Identity verified:** true / false (primary_host.identity_verified)  
- **Superhost:** true / false (primary_host.is_superhost)  
- **Languages** (primary_host.languages)  
- **Member since** (primary_host.member_since)  
- **Response rate** (%) (primary_host.response_rate_without_na)  
- **Response time** (text) (primary_host.response_time_without_na)  
