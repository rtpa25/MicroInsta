# MicroInsta

Social media app on which you can create profile, make friends via friend requests, create posts, like and comment on them.This app is implemented using micro services architecture where each service is deployed in a separate docker container and all the containers are managed by kubernetes.

## Services & Features

- Auth Service (responsible for user auth)

  - Register
  - Login
  - Logout
  - fetch current user data

- Profile Service (responsible for profile creation)

  - Create profile
  - Edit Profile
  - Add Friend Request
  - Accept or delete friend request
  - Delete profile
  - Find profile by username (for searching users)
  - Find profile by userID (for fetching profile data)

- Post Service (responsible for creating posts)

  - Create post and communicate with query service
  - update post with versioning to avoid concurrency issues
  - delete post

- Likes Service (responsible for likes)

  - Like post
  - Unlike post
  - And communicate to query service via nats streaming server

- Comment Service (responsible for comments)

  - Create comment
  - Update comment
  - And communicate to query service via nats streaming server

- Query Service (service responsible for serving all posts combined with likes and there comments)

  - fetch all posts with pagination support
  - fetch detailed view of a single post with all comments
  - fetch all posts of a certain userID with all its associated likes and comments 
  
- Client Service

  - Next web app with chakra UI
  - SWR for data fetching and cache management
  - Redux toolkit for global local state management  
  