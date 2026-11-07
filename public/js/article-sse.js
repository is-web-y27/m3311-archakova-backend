'use strict';

import { Toast } from 'https://unpkg.com/toaster-js@2.2.3/index.js';

const sectionByPath = {
  '/': '#news',
  '/reviews': '#reviews',
  '/events': '#events',
};

const selector =
  sectionByPath[window.location.pathname];

async function refreshCurrentSection() {
  const response =
    await fetch(window.location.pathname);

  if (!response.ok) {
    return;
  }

  const html =
    await response.text();

  const parser =
    new DOMParser();

  const newDocument =
    parser.parseFromString(
      html,
      'text/html',
    );

  const currentSection =
    document.querySelector(selector);

  const newSection =
    newDocument.querySelector(selector);

  if (
    currentSection &&
    newSection
  ) {
    currentSection.innerHTML =
      newSection.innerHTML;
  }
}

if (selector) {
  const eventSource =
    new EventSource(
      '/article-events/stream'
    );

  eventSource.onmessage =
    async (event) => {
      const update =
        JSON.parse(event.data);

      let message =
        `Статья изменена: ${update.title}`;

      let toastType =
        Toast.TYPE_INFO;

      if (update.action === 'created') {
        message =
          `Создана новая статья: ${update.title}`;

        toastType =
          Toast.TYPE_DONE;
      }

      if (update.action === 'updated') {
        message =
          `Статья обновлена: ${update.title}`;

        toastType =
          Toast.TYPE_INFO;
      }

      if (update.action === 'deleted') {
        message =
          `Статья удалена: ${update.title}`;

        toastType =
          Toast.TYPE_WARNING;
      }

      new Toast(
        message,
        toastType,
        Toast.TIME_NORMAL,
      );

      await refreshCurrentSection();
    };
}