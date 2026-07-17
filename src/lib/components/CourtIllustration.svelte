<div class="court" aria-hidden="true">
	<div class="court-surround">
		<div class="court-surface">
			<div class="court-center-line"></div>
			<div class="court-service-line-top"></div>
			<div class="court-service-line-bottom"></div>
			<div class="court-net"></div>
		</div>
	</div>
</div>

<style>
	.court {
		width: 100%;
		max-width: 480px;
		aspect-ratio: 2 / 1;
	}

	.court-surround {
		width: 100%;
		height: 100%;
		padding: 12%;
		background: var(--green);
		border-radius: 16px;
	}

	.court-surface {
		position: relative;
		width: 100%;
		height: 100%;
		background: var(--blue);
		border-radius: 4px;
	}

	.court-center-line {
		position: absolute;
		left: 50%;
		top: 12%;
		width: 2px;
		height: 76%;
		background: var(--white);
		opacity: 0.7;
	}

	.court-net {
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 3px;
		background: var(--white);
		opacity: 0.5;
	}

	.court-service-line-top {
		position: absolute;
		left: 15%;
		right: 15%;
		top: 25%;
		height: 2px;
		background: var(--white);
		opacity: 0.5;
	}

	.court-service-line-bottom {
		position: absolute;
		left: 15%;
		right: 15%;
		bottom: 25%;
		height: 2px;
		background: var(--white);
		opacity: 0.5;
	}
</style>
