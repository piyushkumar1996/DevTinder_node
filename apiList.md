# DevTinder APIs

# authRouter
- POST /signup
- POST /login
- POST /logout

# profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/pasword

# connectRequestRouter
- POST /connection/interseted/:userId
- POST /connection/ignore/:userId


- POST /connection/accept/:userId
- POST /connection/reject/:userId

# userRouer
- GET /feeds - gets the profile of other users on the platform
- GET /user/connection
- GET /user/requests


status : interested, ignore, accept, reject
