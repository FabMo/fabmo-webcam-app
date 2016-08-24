fabmo-webcam-app.fma: clean *.html js/*.js icon.png package.json
	zip fabmo-webcam-app.fma *.html js/*.js icon.png package.json

.PHONY: clean

clean:
	rm -rf fabmo-webcam-app.fma
