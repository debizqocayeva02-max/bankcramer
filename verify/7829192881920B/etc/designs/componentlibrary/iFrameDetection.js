if ((window.location !== window.parent.location) && (document.referrer.indexOf(window.location.host) < 0)) {
  document.write('<img src="/etc/designs/loaded-in-iframe.png?referrer=' + encodeURI(document.referrer) +
    '&initiator=' + encodeURI(window.location.href) + '" alt="" role="presentation">');
}
