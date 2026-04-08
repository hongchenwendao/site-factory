import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "companyStory",
      title: "Company story",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "navigation",
      title: "Navigation",
      type: "array",
      of: [defineArrayMember({ type: "linkItem" })],
    }),
    defineField({
      name: "footerLinks",
      title: "Footer links",
      type: "array",
      of: [defineArrayMember({ type: "linkItem" })],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [defineArrayMember({ type: "linkItem" })],
    }),
    defineField({
      name: "contactHeadline",
      title: "Contact headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactBody",
      title: "Contact body",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
});
