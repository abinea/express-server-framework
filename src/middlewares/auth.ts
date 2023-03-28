import passport from "passport"
import { Strategy as GithubStrategy } from "passport-github"
import auth from "./auth.json"

const GITHUB_STRATEGY_OPTIONS = auth["github"]

const githubStrategy = new GithubStrategy(
	GITHUB_STRATEGY_OPTIONS,
	// 根据 profile 查找或新建 user 信息
	(accessToken, refreshToken, profile, done) => {
		const user = {}
		done(null, user)
	}
)
passport.use(githubStrategy)
//根据 user 信息获取 userId
passport.serializeUser((user, done) => {
	const userId = "46e5"
	done(null, userId)
})
// 根据 userId 获取 user 信息
passport.deserializeUser((userId, done) => {
	const user = {}
	done(null, user)
})

export { passport }
export default function authMiddleware() {
	return [passport.initialize(), passport.session()]
}
