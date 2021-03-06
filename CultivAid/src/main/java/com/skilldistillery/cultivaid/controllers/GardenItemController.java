package com.skilldistillery.cultivaid.controllers;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.skilldistillery.cultivaid.entities.GardenItem;
import com.skilldistillery.cultivaid.entities.User;
import com.skilldistillery.cultivaid.services.GardenItemService;
import com.skilldistillery.cultivaid.services.UserService;

@RestController
@CrossOrigin({"*", "http://localhost:4210"})
public class GardenItemController {
	
	@Autowired
	private GardenItemService itemSvc; 
	
	@Autowired
	private UserService userSvc;
	
	// Non Authenticated
	// Return all garden items
	
	@GetMapping("gardenitems")
	public List<GardenItem> index(HttpServletResponse res, Principal principal) {
		
//		List<GardenItem> items = itemSvc.index(principal.getName());
//		
//		if(items == null) {
//			res.setStatus(404); 
//		}
		
		User user = userSvc.findByUsername(principal.getName());
		return itemSvc.indexAll(user);
	}
	
	// Return all garden items belonging to logged in user
	@GetMapping("api/gardenitems")
	public List<GardenItem> indexUserGardenItems(HttpServletResponse res, Principal principal) {
		
//		List<GardenItem> items = itemSvc.index(principal.getName());
//		
//		if(items == null) {
//			res.setStatus(404); 
//		}
//		
		return itemSvc.index(principal.getName());
	}
	
	@GetMapping("gardenitems/zipsearch/{latitude}&{longitude}&{distance}")
	public List<ArrayList<Object>> indexGardenItemsWithinDistanceOfZip(HttpServletResponse res, @PathVariable Double latitude, @PathVariable Double longitude, @PathVariable Integer distance) {
		
		List<ArrayList<Object>> items = itemSvc.indexWithinDistance(latitude, longitude, distance);
		
		return items;
	}
	
	@GetMapping("api/gardenitems/distancesearch/{distance}")
	public List<ArrayList<Object>> indexGardenItemsWithinDistanceOfUser(HttpServletResponse res, Principal principal, @PathVariable Integer distance) {
		
		List<ArrayList<Object>> items = itemSvc.indexWithinDistance(principal.getName(), distance);
	
		return items;
	}
	
	@GetMapping("api/gardenitems/{id}")
	public GardenItem retrieveById(@PathVariable Integer id, HttpServletResponse res) {
		GardenItem item = itemSvc.retrieveById(id);
		if (item == null) {
			res.setStatus(404);
			return null;
		}
		return item;
	}
	
	
	@PostMapping("api/gardenitems")
	public GardenItem createGardenItem(@RequestBody GardenItem gardenItem, HttpServletResponse res, HttpServletRequest req, Principal principal) {
		GardenItem createdGI = itemSvc.create(gardenItem, principal.getName());
		if (createdGI == null) {
			res.setStatus(400);
		}
		else {
			res.setStatus(201);
			StringBuffer url = req.getRequestURL();
			url.append("/").append(createdGI.getId());
			res.setHeader("Location", url.toString());
		}
		return createdGI;
	}
	
	
	@PutMapping("api/gardenitems")
	public GardenItem updateGardenItem(@RequestBody GardenItem gardenItem, HttpServletResponse res, Principal principal) {
		
		GardenItem itemRequested = null; 
		
		System.out.println("======================================================================================");
		System.out.println(gardenItem);
		System.out.println("======================================================================================");
		
		//Check if Active if 'true' or 'false"
		itemRequested = itemSvc.retrieveByIdForUpdate(gardenItem.getId());
//		if(!gardenItem.isActive()) {
//          Line 117 was here
//			System.out.println("======================================================================================");
//			System.out.println("In IF " + itemRequested);
//			System.out.println("======================================================================================");
//		} else {
//			itemRequested = itemSvc.retrieveById(gardenItem.getId());
//			System.out.println("======================================================================================");
//			System.out.println("In ELSE " + itemRequested);
//			System.out.println("======================================================================================");
//		}
		//
		//
		User loggedInUser = userSvc.findByUsername(principal.getName());
		Boolean isAdmin = loggedInUser.getRole().equals("admin") ? true : false;
		
		System.out.println("======================================================================================");
		System.out.println(itemRequested);
		System.out.println(loggedInUser);
		System.out.println(isAdmin);
		System.out.println("======================================================================================");
		
		if (itemRequested == null || !isAdmin && !itemRequested.getUser().getUsername().equals(principal.getName())) {
			res.setStatus(404);
			return null;
		} 
		System.out.println("======================================================================================");
		System.out.println("Reached this comment");
		System.out.println("======================================================================================");
		GardenItem itemUpdated = itemSvc.update(gardenItem);
		
		if (itemUpdated == null) {
			res.setStatus(400);
		}
		
		return itemUpdated;
	}
	
	
	
	@DeleteMapping("api/gardenitems/{id}")
	public void deleteGardenItem(@PathVariable int id, HttpServletResponse res, Principal principal) {
		GardenItem itemRequested = itemSvc.retrieveById(id);
		if (itemRequested == null || !itemRequested.getUser().getUsername().equals(principal.getName())) {
			res.setStatus(404);
			return;
		}
		Boolean result = itemSvc.delete(id);
		if (result == false) {
			res.setStatus(409);
		}
		else {
			res.setStatus(204);
		}
		return;
	}
}
