package com.repo.commits.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.repo.commits.model.Filter;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api")
public class ApiController extends BaseController {

	final String uri = "https://api.github.com/graphql";

	@PostMapping("fetch")
	public ResponseEntity<?> fetch(@RequestBody Filter filter) {
		if (filter.getOwner() != null && filter.getName() != null && filter.getBranch() != null && filter.getToken() != null
				&& filter.getPerPage() != null) {

			String requestGraphQL = "{\"operationName\":null,\"variables\":{},\"query\":\"" + "{\\n  repository(owner: \\\""
					+ filter.getOwner() + "\\\", name: \\\"" + filter.getName() + "\\\") {\\n    ref(qualifiedName: \\\""
					+ filter.getBranch() + "\\\") {\\n      target {\\n        ... on Commit {\\n          "
					+ "id\\n          history(first: " + filter.getPerPage() + ") {\\n            "
					+ "edges {\\n              node {\\n                status {\\n                  "
					+ "id\\n                  state\\n                  __typename\\n                }\\n                "
					+ "messageHeadline\\n                oid\\n                commitUrl\\n                "
					+ "committedDate\\n                committer {\\n                  "
					+ "date\\n                  name\\n                  "
					+ "avatarUrl\\n                  __typename\\n                }\\n               "
					+ " __typename\\n              }\\n              __typename\\n            "
					+ "}\\n            __typename\\n          }\\n          __typename\\n        "
					+ "}\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}";

			RestTemplate restTemplate = new RestTemplate();
			HttpHeaders headers = new HttpHeaders();
			headers.add("content-type", "application/graphql");
			headers.set("Authorization", "bearer " + filter.getToken());
			HttpEntity<String> entity = new HttpEntity<String>(requestGraphQL, headers);

			return responseOk(restTemplate.postForEntity(uri, entity, JsonNode.class));
		}
		return responseBad("Invalid request");
	}
}
