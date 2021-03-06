package com.skilldistillery.cultivaid.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skilldistillery.cultivaid.entities.GardenItem;
import com.skilldistillery.cultivaid.entities.User;
import com.skilldistillery.cultivaid.repositories.GardenItemRepository;
import com.skilldistillery.cultivaid.repositories.UserRepository;

@Service
public class GardenItemServiceImpl implements GardenItemService {

	class GardenItemComparator implements Comparator<ArrayList<Object>> {
		@Override
		public int compare(ArrayList<Object> o1, ArrayList<Object> o2) {
			return ((Integer) o1.get(1)).compareTo((Integer) o2.get(1));
		}
	}

	public final static double AVERAGE_RADIUS_OF_EARTH_KM = 6371;

	@Autowired
	private GardenItemRepository itemRepo;

	@Autowired
	private UserRepository userRepo;

	// Non Authenticated
	// Return all Garden Items
	
	@Override
	public List<GardenItem> indexAll(User user) {
		return itemRepo.findAllByUser(user);
	}

	// Return all garden items belonging to user
	@Override
	public List<GardenItem> index(String username) {

//	Checking the user might not be needed since authentication should handle that.	
//		List<GardenItem> items = null; 
//		User user = userRepo.findByUsername(username);
//		
//		if(user != null) {
//			items = itemRepo.findByUser_Username(username);
//		}

		return itemRepo.findByActiveTrueAndUser_Username(username);
	}

//	 Return all garden items within specified distance of PostalCode (NOT AUTHENTICATED)
	@Override
	public List<ArrayList<Object>> indexWithinDistance(Double latitude, Double longitude, int distance) {
		List<User> allActiveUsers = userRepo.findByActiveTrue();
		List<ArrayList<Object>> usersWithinSearchDistance = new ArrayList<ArrayList<Object>>();
		for (User user : allActiveUsers) {
			try {
				int distanceApart = calculateDistanceInMiles(latitude, longitude, user.getAddress().getLatitude(), user.getAddress().getLongitude());
				if (distanceApart <= distance) {
					usersWithinSearchDistance.add(new ArrayList<Object>(Arrays.asList(user, (Integer) distanceApart)));
				}
			} catch (Exception e) {
				continue;
			}

		}
		usersWithinSearchDistance.sort(new GardenItemComparator());
		List<ArrayList<Object>> gardenItemsWithinSearchDistance = new ArrayList<ArrayList<Object>>();
		for (ArrayList<Object> userList : usersWithinSearchDistance) {
			List<GardenItem> userGardenItems = itemRepo
					.findByActiveTrueAndUserAndAmountGreaterThan((User) userList.get(0), 0);
			for (GardenItem item : userGardenItems) {
				gardenItemsWithinSearchDistance
						.add(new ArrayList<Object>(Arrays.asList(item, (Integer) userList.get(1))));
			}
		}
		return gardenItemsWithinSearchDistance;
	}

//	 Return all garden items within specified distance of user
	@Override
	public List<ArrayList<Object>> indexWithinDistance(String username, int distance) {
		User loggedInUser = userRepo.findByUsername(username);
		List<User> allActiveUsers = userRepo.findByActiveTrue();
		List<ArrayList<Object>> usersWithinSearchDistance = new ArrayList<ArrayList<Object>>();
		for (User user : allActiveUsers) {
			if (!user.equals(loggedInUser)) {
				try {

					int distanceApart = calculateDistanceInMiles(loggedInUser.getAddress().getLatitude(),
							loggedInUser.getAddress().getLongitude(), user.getAddress().getLatitude(),
							user.getAddress().getLongitude());
					if (distanceApart <= distance) {
						usersWithinSearchDistance
								.add(new ArrayList<Object>(Arrays.asList(user, (Integer) distanceApart)));
					}
				} catch (Exception e) {
					continue;
				}
			}

		}
		usersWithinSearchDistance.sort(new GardenItemComparator());
		List<ArrayList<Object>> gardenItemsWithinSearchDistance = new ArrayList<ArrayList<Object>>();
		for (ArrayList<Object> userList : usersWithinSearchDistance) {
			List<GardenItem> userGardenItems = itemRepo
					.findByActiveTrueAndUserAndAmountGreaterThan((User) userList.get(0), 0);
			for (GardenItem item : userGardenItems) {
				gardenItemsWithinSearchDistance
						.add(new ArrayList<Object>(Arrays.asList(item, (Integer) userList.get(1))));
			}
		}
		return gardenItemsWithinSearchDistance;
	}

	@Override
	public GardenItem retrieveById(int id) {
		GardenItem item = null;
		try {
			item = itemRepo.findByActiveTrueAndId(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return item;
	}
	
	@Override
	public GardenItem retrieveByIdForUpdate(int id) {
		GardenItem item = null;
		try {
			Optional<GardenItem> itemToFind = itemRepo.findById(id);
			if(itemToFind.isPresent()) {
				item = itemToFind.get();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return item;
	}

	@Override
	public GardenItem create(GardenItem item, String username) {
		item.setUser(userRepo.findByUsername(username));
		try {
			return itemRepo.saveAndFlush(item);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public GardenItem update(GardenItem item) {
		
		GardenItem itemToUpdate = null;
		
		//Check if Active if 'true' or 'false"
		itemToUpdate = retrieveByIdForUpdate(item.getId());
		//
		//
		
		itemToUpdate.setDescription(item.getDescription());
		itemToUpdate.setGrowMethod(item.getGrowMethod());
		itemToUpdate.setDateExpected(item.getDateExpected());
		itemToUpdate.setAmount(item.getAmount());
		itemToUpdate.setVariety(item.getVariety());
		itemToUpdate.setPesticides(item.isPesticides());
		itemToUpdate.setFertilizers(item.isFertilizers());
		itemToUpdate.setActive(item.isActive());
		if (item.getProduce() != null) {
			itemToUpdate.setProduce(item.getProduce());
		}
		try {
			return itemRepo.saveAndFlush(itemToUpdate);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public boolean delete(int id) {
		GardenItem itemToDelete = retrieveById(id);
		itemToDelete.setActive(false);
		try {
			itemRepo.saveAndFlush(itemToDelete);
			try {
				retrieveById(id).isActive();
				return false;
			} catch (NullPointerException e) {
				return true;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public int calculateDistanceInMiles(double userLat, double userLng, double venueLat, double venueLng) {

		double latDistance = Math.toRadians(userLat - venueLat);
		double lngDistance = Math.toRadians(userLng - venueLng);

		double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) + Math.cos(Math.toRadians(userLat))
				* Math.cos(Math.toRadians(venueLat)) * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);

		double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return (int) (Math.round(AVERAGE_RADIUS_OF_EARTH_KM * c * 0.621371));
	}

}
