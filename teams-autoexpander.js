// ==UserScript==
// @name         Teams Auto-Expand Chat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto-Expand Chats Topics
// @author       FHaze
// @match        https://teams.microsoft.com/_
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const addEventsListeners = event => {
        const channelList = document.querySelectorAll("li.animate-channel-item")
        console.log(`[Teams Auto-Expand Chat] Adding Channel listener for ${channelList.length} channels`)
        channelList.forEach(ch => {
            ch.removeEventListener("click", event)
            ch.addEventListener("click", event)
        })
    }

    const chatReady = callback => {
        let tries = 0
        let maxTries = 20
        console.log(`[Teams Auto-Expand Chat] Trying to auto-expand topics (maxTries=${maxTries})`)
        const verifyChat = setInterval(() => {
            if (document.querySelectorAll(".ts-message").length === 0) {
                console.log(`[Teams Auto-Expand Chat] Chat not ready (try=${tries})`)
                tries++
                if (tries === maxTries) {
                    clearInterval(verifyChat)
                }
                return
            }
            // Chat is ready
            console.log("[Teams Auto-Expand Chat] Chat is ready")
            callback()
            clearInterval(verifyChat)
        }, 500)
    }

    const TeamsAutoExpand = ({chatMonted, onChannelClick}) => {
        window.onhashchange = e => {
            if (e.newURL.startsWith("https://teams.microsoft.com/_#/conversations") && !e.oldURL.startsWith("https://teams.microsoft.com/_#/conversations")) {
                chatReady(() => {
                    chatMonted()
                    addEventsListeners(onChannelClick)
                })
            }
        }
        chatReady(() => {
            chatMonted()
            addEventsListeners(onChannelClick)
        })
    }

    const doMagic = () => {
        const links = document.querySelectorAll("[data-tid=messageBodyCollapsedString]")
        console.log(`[Teams Auto-Expand Chat] Expanding ${links.length} tabs`)
        links.forEach(l => l.click())
        setTimeout(() => { document.querySelectorAll("virtual-repeat")[0].scrollTop = 1_000_000_000 }, 200)
    }

    TeamsAutoExpand({
        chatMonted: () => doMagic(),
        onChannelClick: () => doMagic()
    })
})();
