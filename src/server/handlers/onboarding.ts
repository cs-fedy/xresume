import { User } from "@prisma/client"
import { z } from "zod"
import { prisma } from "../prisma"

const awardsLikeSchema = z
	.array(
		z.object({
			description: z.string(),
			title: z.string(),
			date: z.date(),
		}),
	)
	.optional()

const volunteerWorkLikeSchema = z
	.array(
		z.object({
			description: z.string(),
			title: z.string(),
			startDate: z.date(),
			endDate: z.date(),
		}),
	)
	.optional()

const arrayStringSchema = z.array(z.string()).optional()

export const onboardingSchema = z.object({
	fullName: z.string().optional(),
	profilePictureURL: z.string().url().optional(),
	phoneNumber: z.string().optional(),
	address: z.string().optional(),
	resumeObjectiveSummary: z.string().optional(),
	workExperience: z
		.array(
			z.object({
				keyResponsibilities: z.date(),
				companyName: z.string(),
				jobTitle: z.string(),
				startDate: z.date(),
				endDate: z.date(),
			}),
		)
		.optional(),
	education: z
		.array(
			z.object({
				earnedDegree: z.string(),
				institutionName: z.string(),
				graduationDate: z.date(),
				startDate: z.date(),
			}),
		)
		.optional(),
	softSkills: arrayStringSchema,
	technicalSkills: arrayStringSchema,
	awards: awardsLikeSchema,
	achievements: awardsLikeSchema,
	certifications: awardsLikeSchema,
	spokenLanguages: arrayStringSchema,
	interestsHobbies: arrayStringSchema,
	volunteerWork: volunteerWorkLikeSchema,
	associativeExperiences: volunteerWorkLikeSchema,
})

export type OnboardingArgs = z.infer<typeof onboardingSchema>

type OnboardingHandlerArgs = {
	args: OnboardingArgs
	loggedUser: User
}

type WorkExperience = OnboardingArgs["workExperience"]
function formatWorkExperience(
	newWorkExperience: WorkExperience,
	currentWorkExperience: string,
) {
	if (!newWorkExperience) return currentWorkExperience

	const formattedNewWorkExperience = newWorkExperience.map(
		experience =>
			`${experience.companyName}\t` +
			`${experience.jobTitle}\t` +
			`${experience.startDate}\t` +
			`${experience.endDate}\t` +
			`${experience.keyResponsibilities}`,
	)

	return (
		currentWorkExperience === "-"
			? formattedNewWorkExperience
			: [currentWorkExperience, ...formattedNewWorkExperience]
	).join("\n")
}

type Education = OnboardingArgs["education"]
function formatEducation(newEducation: Education, currentEducation: string) {
	if (!newEducation) return currentEducation

	const formattedNewEducation = newEducation.map(
		education =>
			`${education.earnedDegree}\t` +
			`${education.institutionName}\t` +
			`${education.startDate}\t` +
			`${education.startDate}\t` +
			`${education.graduationDate}`,
	)

	return (
		currentEducation === "-"
			? formattedNewEducation
			: [currentEducation, ...formattedNewEducation]
	).join("\n")
}

function formatArrayOfString(
	array: Array<string> | undefined,
	currentValue: string,
) {
	if (!array) return currentValue
	return (currentValue === "-" ? array : [currentValue, ...array]).join("\n")
}

type Award = OnboardingArgs["awards"]
function formatAwardLike(newAward: Award, currentAward: string) {
	if (!newAward) return currentAward

	const formattedNewAward = newAward.map(
		award => `${award.title}\t${award.date}\t${award.description}`,
	)

	return (
		currentAward === "-"
			? formattedNewAward
			: [currentAward, ...formattedNewAward]
	).join("\n")
}

type VolunteerWork = OnboardingArgs["volunteerWork"]
function formatVolunteerWorkLike(
	newVolunteerWork: VolunteerWork,
	currentVolunteerWork: string,
) {
	if (!newVolunteerWork) return currentVolunteerWork

	const formattedNewVolunteerWork = newVolunteerWork.map(
		volunteerWork =>
			`${volunteerWork.title}\t` +
			`${volunteerWork.startDate}\t` +
			`${volunteerWork.endDate}\t` +
			`${volunteerWork.description}`,
	)

	return (
		currentVolunteerWork === "-"
			? formattedNewVolunteerWork
			: [currentVolunteerWork, ...formattedNewVolunteerWork]
	).join("\n")
}

export async function onboardingHandler({
	args,
	loggedUser,
}: OnboardingHandlerArgs) {
	await prisma.user.update({
		where: { id: loggedUser.id },
		data: {
			...{
				isFirstTime: false,
				fullName: args.fullName,
				profilePictureURL: args.profilePictureURL,
				phoneNumber: args.phoneNumber,
				address: args.address,
				resumeObjectiveSummary: args.resumeObjectiveSummary,
				education: formatEducation(args.education, loggedUser.education),
				softSkills: formatArrayOfString(args.softSkills, loggedUser.softSkills),
				volunteerWork: formatVolunteerWorkLike(
					args.volunteerWork,
					loggedUser.volunteerWork,
				),
				associativeExperiences: formatVolunteerWorkLike(
					args.associativeExperiences,
					loggedUser.associativeExperiences,
				),
				spokenLanguages: formatArrayOfString(
					args.spokenLanguages,
					loggedUser.spokenLanguages,
				),
				interestsHobbies: formatArrayOfString(
					args.interestsHobbies,
					loggedUser.interestsHobbies,
				),
				awards: formatAwardLike(args.awards, loggedUser.awards),
				certifications: formatAwardLike(
					args.certifications,
					loggedUser.certifications,
				),
				achievements: formatAwardLike(
					args.achievements,
					loggedUser.achievements,
				),
				technicalSkills: formatArrayOfString(
					args.technicalSkills,
					loggedUser.technicalSkills,
				),
				workExperience: formatWorkExperience(
					args.workExperience,
					loggedUser.workExperience,
				),
			},
		},
	})

	return { success: true, message: "user updated successfully" }
}
