package com.repo.commits.model;

public class Filter {

	private String owner;
	private String name;
	private String branch;
	private String token;
	private Integer perPage;

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Integer getPerPage() {
		return perPage;
	}

	public void setPerPage(Integer perPage) {
		this.perPage = perPage;
	}

	@Override
	public String toString() {
		return "Filter [owner=" + owner + ", name=" + name + ", branch=" + branch + ", token=" + token + ", perPage="
				+ perPage + "]";
	}

}
