import { defineArrayMember, defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "productCategory" }],
    }),
    defineField({
      name: "specifications",
      title: "Specifications",
      type: "array",
      of: [defineArrayMember({ type: "specificationItem" })],
    }),
    defineField({
      name: "moq",
      title: "Minimum Order Quantity",
      type: "string",
      description: "e.g. '100 units'",
    }),
    defineField({
      name: "leadTime",
      title: "Lead Time",
      type: "string",
      description: "e.g. '15-20 days'",
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "relatedPosts",
      title: "Related posts",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "post" }] })],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "images.0",
    },
  },
});
