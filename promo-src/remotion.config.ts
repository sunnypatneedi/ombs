import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// The recreated interface is flat vector-ish UI on a near-white field; CRF 18 keeps the
// 2px --s200 borders and the mono code chip crisp without a 60MB file.
Config.setCrf(18);
Config.setChromiumOpenGlRenderer("angle");
