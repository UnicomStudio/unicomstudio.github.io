import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Newicom",
  description: "Studio for Unicom",
  head: [
    ['link', { rel: "shortcut icon", href: "/Unicom.ico"}],
    ['link', { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@callmebill/lxgw-wenkai-web@latest/style.css"}],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      {
        text: 'Android',
        items: [
          {
            text: 'ROM 开发',
            items: [
              { text: '设备树', link: '/android/rom/device-tree/' }
            ]
          },
          {
            text: '软件推荐',
            items: [
              { text: '概览', link: '/android/software/' }
            ]
          }
        ]
      },
    ],

    sidebar: [
      {
        text: 'Android',
        items: [
          {
            text: '软件推荐',
            collapsed: false,
            items: [
              { text: '概览', link: '/android/software/' }
            ]
          },
          {
            text: 'ROM 开发',
            collapsed: false,
            items: [
              { text: 'Device Tree', link: '/android/rom/device-tree/' }
            ]
          }
        ]
      }
    ],

    socialLinks: [
      {
        icon: 'maildotru',
        link: 'mailto:849919718@qq.com'
      }
    ]
  }
})
