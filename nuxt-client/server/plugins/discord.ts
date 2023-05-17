import { DiscordClient } from "../bot/discord"

export default defineNitroPlugin((nitroApp) => {
  const discordClient: DiscordClient = DiscordClient.getInstance()
  discordClient.initialize("MTA2NjMxMTA1MTEyNzI5MTk0NA.GobNi_.WvD1j2IlPFTitHX9sIAXihEcOW74UM5bHnrSds")
})