
import gql from 'graphql-tag';

export function fetchQl(owner = 'angular', name = 'angular', branch = 'master', first = 25) {
  return gql`
  {
    repository(owner: "${owner.trim()}", name: "${name.trim()}") {
      ref(qualifiedName: "${branch.trim()}") {
        target {
          ... on Commit {
            id
            history(first: ${first}) {
              edges {
                node {
                  status {
                    id
                    state
                  }
                  messageHeadline
                  oid
                  commitUrl
                  committedDate
                  committer {
                    date
                    name
                    avatarUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  `;
}
