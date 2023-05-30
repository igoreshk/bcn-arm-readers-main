#!/bin/sh

service dbus start

# Start Bluez
/usr/libexec/bluetooth/bluetoothd --debug &

# Show bluetooth devices:
hcitool dev

# Run scanning
python3 /iscan3/run_scanning.py

# In case of failure keep container alive to allow debugging
sleep infinity

exec "$@"
