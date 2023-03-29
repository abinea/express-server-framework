import merge from "lodash.merge"

const config = {
	// 默认配置
	default: {
		sessionCookieSecret: "d41d8cd98f00b204e9800998ecf8427ea378d269",
		sessionCookieMaxAge: 7 * 24 * 60 * 60 * 1000,

		homepagePath: "/",
		loginPath: "/login.html",
		loginWhiteList: {
			"/500.html": ["get"],
			"/api/health": ["get"],
			"/api/csrf/script": ["get"],
			"/api/login": ["post"],
			"/api/login/github": ["get"],
			"/api/login/github/callback": ["get"],
		},

		githubStrategyOptions: {
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "http://localhost:3000/api/login/github/callback",
		},

		db: {
			dialect: "sqlite",
			storage: ":memory:",
			define: {
				underscored: true,
			},
			migrationStorageTableName: "sequelize_meta",
		},
	},

	// 本地配置
	development: {
		db: {
			storage: "database/dev.db",
		},
	},

	// 测试配置
	test: {
		db: {
			logging: false,
		},
	},

	// 部署配置
	production: {
		sessionCookieMaxAge: 3 * 24 * 60 * 60 * 1000,

		githubStrategyOptions: {
			callbackURL: "http://localhost:9090/api/login/github/callback",
		},

		db: {
			storage: "database/prod.db",
		},
	},
}
export default merge(
	{},
	config.default,
	config[process.env.NODE_ENV || "development"]
)
