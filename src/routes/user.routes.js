import { Router } from "express";
import { 
  loginUser, 
  logoutUser, 
  registerUser, 
  refreshAccessToken,changeCurrentPassword, 
  getCurrentUser, 
  updateAccountDetails, 
  updateUserAvatar, 
  updateUserCoverImage, 
  getUserChannelProfile, 
  getWatchHistory 
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router
  .route("/register").post(  // jate hue pehle mujse milkar jana
    upload.fields([   //middleware before registerUser
      {
        name: "avatar",
        maxCount: 1,  //kitni file accept karonge 
      }, 
      {
        name: "coverImage",
        maxCount: 1,
      },
    ]),
    registerUser
);

router.route("/login").post(loginUser)

//seured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)   //upload is middleware and .single() for select a one file
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)  //params mathi url ave che
router.route("/watchhistory").get(verifyJWT, getWatchHistory)

export default router;
