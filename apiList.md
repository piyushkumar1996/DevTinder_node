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
- POST /request/send/interseted/:userId
- POST /request/send/ignore/:userId
- POST /request/send/accept/:userId
- POST /request/send/reject/:userId

# userRouer
- GET /feeds - gets the profile of other users on the platform
- GET /user/connection
- GET /user/requests


status : interested, ignore, accept, reject
