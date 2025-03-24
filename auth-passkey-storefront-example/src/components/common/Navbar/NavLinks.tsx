import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"

type Props = {
  data: {
    title: string
    link: string
  }[]
  className?: string
}

const NavLinks = ({ data, className }: Props) => {
  return (
    <div
      className={cn(
        "flex gap-8 items-center justify-center max-md:hidden pb-4",
        className
      )}
    >
      {data.map((item, index) => {
        return (
          <LocalizedClientLink
            key={index}
            href={item.link}
            className="relative text-caption1 text-black uppercase"
          >
            {item.title}
          </LocalizedClientLink>
        )
      })}
      <a
        href="mailto:Support@DBDoesIt.com?subject=DB Does It File"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Send File
      </a>
    </div>
  )
}

export default NavLinks
